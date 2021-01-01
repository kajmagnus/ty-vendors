"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHaveAttr = exports.toHaveAttribute = exports.toHaveAttributeFn = void 0;
const utils_1 = require("../../utils");
const expectAdapter_1 = require("../../util/expectAdapter");
async function condition(el, attribute, value, options) {
    const attr = await el.getAttribute(attribute);
    if (typeof attr !== 'string') {
        return { result: false, value: attr };
    }
    if (typeof value !== 'string') {
        return { result: true, value: attr };
    }
    return utils_1.compareText(attr, value, options);
}
function toHaveAttributeFn(received, attribute, value, options = {}) {
    const isNot = this.isNot;
    const { expectation = 'attribute', verb = 'have' } = this;
    return browser.call(async () => {
        let el = await received;
        let attr;
        const pass = await utils_1.waitUntil(async () => {
            const result = await utils_1.executeCommand.call(this, el, condition, options, [attribute, value, options]);
            el = result.el;
            attr = result.values;
            return result.success;
        }, isNot, options);
        utils_1.updateElementsArray(pass, received, el);
        let message;
        if (typeof value === 'string') {
            const expected = utils_1.wrapExpectedWithArray(el, attr, value);
            message = utils_1.enhanceError(el, expected, attr, this, verb, expectation, attribute, options);
        }
        else {
            message = utils_1.enhanceError(el, !isNot, pass, this, verb, expectation, attribute, options);
        }
        return {
            pass,
            message: () => message
        };
    });
}
exports.toHaveAttributeFn = toHaveAttributeFn;
function toHaveAttribute(...args) {
    return expectAdapter_1.runExpect.call(this, toHaveAttributeFn, args);
}
exports.toHaveAttribute = toHaveAttribute;
exports.toHaveAttr = toHaveAttribute;
