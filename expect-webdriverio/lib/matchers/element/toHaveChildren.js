"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHaveChildren = void 0;
const utils_1 = require("../../utils");
const expectAdapter_1 = require("../../util/expectAdapter");
async function condition(el, gte, lte, eq) {
    const children = await el.$$('./*');
    return {
        result: utils_1.compareNumbers(children.length, gte, lte, eq),
        value: children.length
    };
}
function toHaveChildrenFn(received, size, options = {}) {
    const isNot = this.isNot;
    const { expectation = 'children', verb = 'have' } = this;
    if (typeof size === 'number') {
        options.eq = size;
    }
    else if (typeof size === 'object') {
        options = { ...options, ...size };
    }
    const eq = options.eq;
    const gte = options.gte || 1;
    const lte = options.lte || 0;
    return browser.call(async () => {
        let el = await received;
        let children;
        const pass = await utils_1.waitUntil(async () => {
            const result = await utils_1.executeCommand.call(this, el, condition, options, [gte, lte, eq]);
            el = result.el;
            children = result.values;
            return result.success;
        }, isNot, options);
        utils_1.updateElementsArray(pass, received, el);
        const error = utils_1.numberError(gte, lte, eq);
        const expected = utils_1.wrapExpectedWithArray(el, children, error);
        const message = utils_1.enhanceError(el, expected, children, this, verb, expectation, '', options);
        return {
            pass,
            message: () => message
        };
    });
}
function toHaveChildren(...args) {
    return expectAdapter_1.runExpect.call(this, toHaveChildrenFn, args);
}
exports.toHaveChildren = toHaveChildren;
