"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeRequested = void 0;
const utils_1 = require("../../utils");
const expectAdapter_1 = require("../../util/expectAdapter");
function toBeRequestedFn(received, options = {}) {
    const isNot = this.isNot || false;
    const { expectation = `called`, verb = 'be' } = this;
    return browser.call(async () => {
        let actual;
        const pass = await utils_1.waitUntil(async () => {
            actual = received.calls.length;
            return actual > 0;
        }, isNot, options);
        const message = utils_1.enhanceError('mock', 0, actual, this, verb, expectation, '', options);
        return {
            pass,
            message: () => message
        };
    });
}
function toBeRequested(...args) {
    return expectAdapter_1.runExpect.call(this, toBeRequestedFn, args);
}
exports.toBeRequested = toBeRequested;
