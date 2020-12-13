"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeElementsArrayOfSize = void 0;
const utils_1 = require("../../utils");
const refetchElements_1 = require("../../util/refetchElements");
const expectAdapter_1 = require("../../util/expectAdapter");
function toBeElementsArrayOfSizeFn(received, size, options = {}) {
    const isNot = this.isNot;
    const { expectation = 'elements array of size', verb = 'be' } = this;
    if (typeof size === 'number') {
        options.eq = size;
    }
    else if (!size || (typeof size.eq !== 'number' && typeof size.gte !== 'number' && typeof size.lte !== 'number')) {
        throw new Error('Invalid params passed to toBeElementsArrayOfSize.');
    }
    else {
        options = size;
    }
    const eq = options.eq;
    const gte = options.gte || 1;
    const lte = options.lte || 0;
    return browser.call(async () => {
        let elements = await received;
        const arrLength = elements.length;
        const pass = await utils_1.waitUntil(async () => {
            elements = await refetchElements_1.refetchElements(elements, options.wait, true);
            return utils_1.compareNumbers(elements.length, gte, lte, eq);
        }, isNot, options);
        utils_1.updateElementsArray(pass, received, elements, true);
        const error = utils_1.numberError(gte, lte, eq);
        const message = utils_1.enhanceError(elements, error, arrLength, this, verb, expectation, '', options);
        return {
            pass,
            message: () => message
        };
    });
}
function toBeElementsArrayOfSize(...args) {
    return expectAdapter_1.runExpect.call(this, toBeElementsArrayOfSizeFn, args);
}
exports.toBeElementsArrayOfSize = toBeElementsArrayOfSize;
