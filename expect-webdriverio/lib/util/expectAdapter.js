"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runExpect = exports.jestResultToJasmine = exports.buildJasmineFromJestResult = exports.getContext = void 0;
const options_1 = require("../options");
const config = options_1.getConfig();
const { mode: MODE } = config;
exports.getContext = (context) => global === context ? {} : context || {};
function runJestExpect(fn, args) {
    return fn.apply(this, args);
}
exports.buildJasmineFromJestResult = (result, isNot) => {
    return {
        pass: result.pass !== isNot,
        message: result.message()
    };
};
exports.jestResultToJasmine = (result, isNot) => {
    if (result instanceof Promise) {
        return result.then(jestStyleResult => exports.buildJasmineFromJestResult(jestStyleResult, isNot));
    }
    return exports.buildJasmineFromJestResult(result, isNot);
};
function runJasmineExpect(fn) {
    const context = exports.getContext(this);
    return {
        compare(...args) {
            const result = fn.apply({ ...context, isNot: false }, args);
            return exports.jestResultToJasmine(result, false);
        },
        negativeCompare(...args) {
            const result = fn.apply({ ...context, isNot: true }, args);
            return exports.jestResultToJasmine(result, true);
        }
    };
}
exports.runExpect = MODE === 'jasmine' ? runJasmineExpect : runJestExpect;
