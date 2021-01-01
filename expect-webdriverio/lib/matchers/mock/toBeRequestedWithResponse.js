"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeRequestedWithResponse = void 0;
const utils_1 = require("../../utils");
const expectAdapter_1 = require("../../util/expectAdapter");
const jasmineUtils_1 = require("../../jasmineUtils");
function toBeRequestedWithResponseFn(received, response, options = {}) {
    const isNot = this.isNot || false;
    const { expectation = 'called', verb = 'be' } = this;
    return browser.call(async () => {
        let actual;
        const pass = await utils_1.waitUntil(async () => {
            if (received.calls.length === 0) {
                return isNot;
            }
            if (isNot) {
                return !received.calls.reduce((res, mock) => res || jasmineUtils_1.equals(mock === null || mock === void 0 ? void 0 : mock.body, response), false);
            }
            return Boolean(received.calls.find((mock) => {
                actual = mock === null || mock === void 0 ? void 0 : mock.body;
                return !isNot === jasmineUtils_1.equals(mock === null || mock === void 0 ? void 0 : mock.body, response);
            }));
        });
        const message = utils_1.enhanceError('mock', response, actual, this, verb, expectation, '', options);
        return {
            pass,
            message: () => message
        };
    });
}
function toBeRequestedWithResponse(...args) {
    return expectAdapter_1.runExpect.call(this, toBeRequestedWithResponseFn, args);
}
exports.toBeRequestedWithResponse = toBeRequestedWithResponse;
