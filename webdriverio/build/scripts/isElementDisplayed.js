"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isElementDisplayed(element) {
    function nodeIsElement(node) {
        if (!node) {
            return false;
        }
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
            case Node.DOCUMENT_NODE:
            case Node.DOCUMENT_FRAGMENT_NODE:
                return true;
            default:
                return false;
        }
    }
    function parentElementForElement(element) {
        if (!element) {
            return null;
        }
        return enclosingNodeOrSelfMatchingPredicate(element.parentNode, nodeIsElement);
    }
    function enclosingNodeOrSelfMatchingPredicate(targetNode, predicate) {
        for (let node = targetNode; node && node !== targetNode.ownerDocument; node = node.parentNode)
            if (predicate(node)) {
                return node;
            }
        return null;
    }
    function enclosingElementOrSelfMatchingPredicate(targetElement, predicate) {
        for (let element = targetElement; element && element !== targetElement.ownerDocument; element = parentElementForElement(element))
            if (predicate(element)) {
                return element;
            }
        return null;
    }
    function cascadedStylePropertyForElement(element, property) {
        if (!element || !property) {
            return null;
        }
        if (element instanceof DocumentFragment) {
            element = element.host;
        }
        let computedStyle = window.getComputedStyle(element);
        let computedStyleProperty = computedStyle.getPropertyValue(property);
        if (computedStyleProperty && computedStyleProperty !== 'inherit') {
            return computedStyleProperty;
        }
        let parentElement = parentElementForElement(element);
        return cascadedStylePropertyForElement(parentElement, property);
    }
    function elementSubtreeHasNonZeroDimensions(element) {
        let boundingBox = element.getBoundingClientRect();
        if (boundingBox.width > 0 && boundingBox.height > 0) {
            return true;
        }
        if (element.tagName.toUpperCase() === 'PATH' && boundingBox.width + boundingBox.height > 0) {
            let strokeWidth = cascadedStylePropertyForElement(element, 'stroke-width');
            return !!strokeWidth && (parseInt(strokeWidth, 10) > 0);
        }
        let cascadedOverflow = cascadedStylePropertyForElement(element, 'overflow');
        if (cascadedOverflow === 'hidden') {
            return false;
        }
        return Array.from(element.childNodes).some((childNode) => {
            if (childNode.nodeType === Node.TEXT_NODE) {
                return true;
            }
            if (nodeIsElement(childNode)) {
                return elementSubtreeHasNonZeroDimensions(childNode);
            }
            return false;
        });
    }
    function elementOverflowsContainer(element) {
        let cascadedOverflow = cascadedStylePropertyForElement(element, 'overflow');
        if (cascadedOverflow !== 'hidden') {
            return false;
        }
        return true;
    }
    function isElementSubtreeHiddenByOverflow(element) {
        if (!element) {
            return false;
        }
        if (!elementOverflowsContainer(element)) {
            return false;
        }
        if (!element.childNodes.length) {
            return false;
        }
        return Array.from(element.childNodes).every((childNode) => {
            if (childNode.nodeType === Node.TEXT_NODE) {
                return false;
            }
            if (!nodeIsElement(childNode)) {
                return true;
            }
            if (!elementSubtreeHasNonZeroDimensions(childNode)) {
                return true;
            }
            return isElementSubtreeHiddenByOverflow(childNode);
        });
    }
    function isElementInsideShadowRoot(element) {
        if (!element) {
            return false;
        }
        if (element.parentNode && element.parentNode.host) {
            return true;
        }
        return isElementInsideShadowRoot(element.parentNode);
    }
    if (!isElementInsideShadowRoot(element) && !document.contains(element)) {
        return false;
    }
    switch (element.tagName.toUpperCase()) {
        case 'BODY':
            return true;
        case 'SCRIPT':
        case 'NOSCRIPT':
            return false;
        case 'OPTGROUP':
        case 'OPTION': {
            let enclosingSelectElement = enclosingNodeOrSelfMatchingPredicate(element, (e) => e.tagName.toUpperCase() === 'SELECT');
            return isElementDisplayed(enclosingSelectElement);
        }
        case 'INPUT':
            if (element.type === 'hidden') {
                return false;
            }
            break;
        default:
            break;
    }
    if (cascadedStylePropertyForElement(element, 'visibility') !== 'visible') {
        return false;
    }
    let hasAncestorWithZeroOpacity = !!enclosingElementOrSelfMatchingPredicate(element, (e) => {
        return Number(cascadedStylePropertyForElement(e, 'opacity')) === 0;
    });
    let hasAncestorWithDisplayNone = !!enclosingElementOrSelfMatchingPredicate(element, (e) => {
        return cascadedStylePropertyForElement(e, 'display') === 'none';
    });
    if (hasAncestorWithZeroOpacity || hasAncestorWithDisplayNone) {
        return false;
    }
    if (!elementSubtreeHasNonZeroDimensions(element)) {
        return false;
    }
    if (isElementSubtreeHiddenByOverflow(element)) {
        return false;
    }
    return true;
}
exports.default = isElementDisplayed;
