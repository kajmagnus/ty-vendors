"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aliasFn = exports.compareNumbers = exports.waitUntil = exports.executeCommandBe = exports.executeCommand = exports.numberError = exports.enhanceError = exports.wrapExpectedWithArray = exports.updateElementsArray = exports.compareText = void 0;
const options_1 = require("./options");
const executeCommand_1 = require("./util/executeCommand");
Object.defineProperty(exports, "executeCommand", { enumerable: true, get: function () { return executeCommand_1.executeCommand; } });
const elementsUtil_1 = require("./util/elementsUtil");
Object.defineProperty(exports, "wrapExpectedWithArray", { enumerable: true, get: function () { return elementsUtil_1.wrapExpectedWithArray; } });
Object.defineProperty(exports, "updateElementsArray", { enumerable: true, get: function () { return elementsUtil_1.updateElementsArray; } });
const formatMessage_1 = require("./util/formatMessage");
Object.defineProperty(exports, "enhanceError", { enumerable: true, get: function () { return formatMessage_1.enhanceError; } });
Object.defineProperty(exports, "numberError", { enumerable: true, get: function () { return formatMessage_1.numberError; } });
const expectAdapter_1 = require("./util/expectAdapter");
const config = options_1.getConfig();
const { options: DEFAULT_OPTIONS } = config;
const waitUntil = async (condition, isNot = false, { wait = DEFAULT_OPTIONS.wait, interval = DEFAULT_OPTIONS.interval } = {}) => {
    if (wait === 0) {
        return await condition();
    }
    try {
        let error;
        await browser.waitUntil(async () => {
            error = undefined;
            try {
                return isNot !== await condition();
            }
            catch (err) {
                error = err;
                return false;
            }
        }, {
            timeout: wait,
            interval
        });
        if (error) {
            throw error;
        }
        return !isNot;
    }
    catch (err) {
        return isNot;
    }
};
exports.waitUntil = waitUntil;
async function executeCommandBe(received, command, options) {
    const { isNot, expectation, verb = 'be' } = this;
    let el = await received;
    const pass = await waitUntil(async () => {
        const result = await executeCommand_1.executeCommand.call(this, el, async (element) => ({ result: await command(element) }), options);
        el = result.el;
        return result.success;
    }, isNot, options);
    elementsUtil_1.updateElementsArray(pass, received, el);
    const message = formatMessage_1.enhanceErrorBe(el, pass, this, verb, expectation, options);
    return {
        pass,
        message: () => message
    };
}
exports.executeCommandBe = executeCommandBe;
const compareNumbers = (actual, gte, lte, eq) => {
    if (typeof eq === 'number') {
        return actual === eq;
    }
    if (lte > 0 && actual > lte) {
        return false;
    }
    return actual >= gte;
};
exports.compareNumbers = compareNumbers;
exports.compareText = (actual, expected, { ignoreCase = false, trim = false, containing = false }) => {
    if (typeof actual !== 'string') {
        return {
            value: actual,
            result: false
        };
    }
    if (trim) {
        actual = actual.trim();
    }
    if (ignoreCase) {
        actual = actual.toLowerCase();
        expected = expected.toLowerCase();
    }
    if (containing) {
        return {
            value: actual,
            result: actual.includes(expected)
        };
    }
    return {
        value: actual,
        result: actual === expected
    };
};
function aliasFn(fn, { verb, expectation } = {}, ...args) {
    const context = expectAdapter_1.getContext(this);
    context.verb = verb;
    context.expectation = expectation;
    return fn.apply(context, args);
}
exports.aliasFn = aliasFn;
