"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.react$$ = exports.react$ = exports.waitToLoadReact = void 0;
exports.waitToLoadReact = function waitToLoadReact() {
    window.resq.waitToLoadReact();
};
exports.react$ = function react$(selector, props, state, reactElement) {
    props = props || {};
    state = state || {};
    let element = window.resq.resq$(selector, reactElement);
    if (Object.keys(props).length) {
        element = element.byProps(props);
    }
    if (Object.keys(state).length) {
        element = element.byState(state);
    }
    if (!element.name) {
        return { message: `React element with selector "${selector}" wasn't found` };
    }
    return element.isFragment && element.node
        ? element.node[0]
        : element.node;
};
exports.react$$ = function react$$(selector, props, state, reactElement) {
    let elements = window.resq.resq$$(selector, reactElement);
    if (Object.keys(props).length) {
        elements = elements.byProps(props);
    }
    if (Object.keys(state).length) {
        elements = elements.byState(state);
    }
    if (!elements.length) {
        return [];
    }
    let nodes = [];
    elements.forEach(element => {
        const { node, isFragment } = element;
        if (isFragment) {
            nodes = nodes.concat(node || []);
        }
        else if (node) {
            nodes.push(node);
        }
    });
    return [...nodes];
};
