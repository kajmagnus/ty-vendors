"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isElementClickable(elem) {
    if (!elem.getBoundingClientRect || !elem.scrollIntoView || !elem.contains || !elem.getClientRects || !document.elementFromPoint) {
        return false;
    }
    const isOldEdge = !!window.StyleMedia;
    const scrollIntoViewFullSupport = !(window.safari || isOldEdge);
    function getOverlappingElement(elem, context) {
        context = context || document;
        const elemDimension = elem.getBoundingClientRect();
        const x = elemDimension.left + (elem.clientWidth / 2);
        const y = elemDimension.top + (elem.clientHeight / 2);
        return context.elementFromPoint(x, y);
    }
    function getOverlappingRects(elem, context) {
        context = context || document;
        const elems = [];
        const rects = elem.getClientRects();
        const rect = rects[0];
        const x = rect.left + (rect.width / 2);
        const y = rect.top + (rect.height / 2);
        elems.push(context.elementFromPoint(x, y));
        return elems;
    }
    function getOverlappingElements(elem, context) {
        return [getOverlappingElement(elem, context)].concat(getOverlappingRects(elem, context));
    }
    function nodeContains(elem, otherNode) {
        if (isOldEdge) {
            let tmpElement = otherNode;
            while (tmpElement) {
                if (tmpElement === elem) {
                    return true;
                }
                tmpElement = tmpElement.parentNode;
                if (tmpElement && tmpElement.nodeType === 11 && tmpElement.host) {
                    tmpElement = tmpElement.host;
                }
            }
            return false;
        }
        return elem.contains(otherNode);
    }
    function isOverlappingElementMatch(elementsFromPoint, elem) {
        if (elementsFromPoint.some(function (elementFromPoint) {
            return elementFromPoint === elem || nodeContains(elem, elementFromPoint);
        })) {
            return true;
        }
        let elemsWithShadowRoot = [].concat(elementsFromPoint);
        elemsWithShadowRoot = elemsWithShadowRoot.filter(function (x) {
            return x && x.shadowRoot && x.shadowRoot.elementFromPoint;
        });
        let shadowElementsFromPoint = [];
        for (let i = 0; i < elemsWithShadowRoot.length; ++i) {
            let shadowElement = elemsWithShadowRoot[i];
            shadowElementsFromPoint = shadowElementsFromPoint.concat(getOverlappingElements(elem, shadowElement.shadowRoot));
        }
        shadowElementsFromPoint = [].concat(shadowElementsFromPoint);
        shadowElementsFromPoint = shadowElementsFromPoint.filter(function (x) {
            return !elementsFromPoint.includes(x);
        });
        if (shadowElementsFromPoint.length === 0) {
            return false;
        }
        return isOverlappingElementMatch(shadowElementsFromPoint, elem);
    }
    function isElementInViewport(elem) {
        if (!elem.getBoundingClientRect) {
            return false;
        }
        const rect = elem.getBoundingClientRect();
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
        const windowWidth = (window.innerWidth || document.documentElement.clientWidth);
        const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) > 0);
        const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) > 0);
        return (vertInView && horInView);
    }
    function isClickable(elem) {
        return (isElementInViewport(elem) && elem.disabled !== true &&
            isOverlappingElementMatch(getOverlappingElements(elem), elem));
    }
    if (!isClickable(elem)) {
        elem.scrollIntoView(scrollIntoViewFullSupport ? { block: 'nearest', inline: 'nearest' } : false);
        if (!isClickable(elem)) {
            elem.scrollIntoView(scrollIntoViewFullSupport ? { block: 'center', inline: 'center' } : true);
            return isClickable(elem);
        }
    }
    return true;
}
exports.default = isElementClickable;
