"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeRequestedTimes = void 0;
const utils_1 = require("../../utils");
const expectAdapter_1 = require("../../util/expectAdapter");
const formatMessage_1 = require("../../util/formatMessage");
function toBeRequestedTimesFn(received, times = {}, options = {}) {
    const isNot = this.isNot || false;
    const { expectation = `called${typeof times === 'number' ? ' ' + times : ''} time${times !== 1 ? 's' : ''}`, verb = 'be' } = this;
    const eq = typeof times === 'number' ? times : times.eq;
    const gte = typeof times === 'number' ? 1 : (times.gte || 1);
    const lte = typeof times === 'number' ? 0 : (times.lte || 0);
    return browser.call(async () => {
        let actual;
        const pass = await utils_1.waitUntil(async () => {
            actual = received.calls.length;
            return utils_1.compareNumbers(actual, gte, lte, eq);
        }, isNot, options);
        const error = formatMessage_1.numberError(gte, lte, eq);
        const message = utils_1.enhanceError('mock', error, actual, this, verb, expectation, '', options);
        return {
            pass,
            message: () => message
        };
    });
}
function toBeRequestedTimes(...args) {
    return expectAdapter_1.runExpect.call(this, toBeRequestedTimesFn, args);
}
exports.toBeRequestedTimes = toBeRequestedTimes;
