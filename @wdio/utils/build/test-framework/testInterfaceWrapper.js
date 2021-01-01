"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTestInFiberContext = exports.wrapTestFunction = exports.runSpec = exports.runHook = void 0;
const utils_1 = require("../utils");
const testFnWrapper_1 = require("./testFnWrapper");
const MOCHA_COMMANDS = ['skip', 'only'];
exports.runHook = function (hookFn, origFn, beforeFn, beforeFnArgs, afterFn, afterFnArgs, cid, repeatTest) {
    return origFn(function (...hookFnArgs) {
        return testFnWrapper_1.testFnWrapper.call(this, 'Hook', {
            specFn: hookFn,
            specFnArgs: utils_1.filterSpecArgs(hookFnArgs)
        }, {
            beforeFn,
            beforeFnArgs
        }, {
            afterFn,
            afterFnArgs
        }, cid, repeatTest);
    });
};
exports.runSpec = function (specTitle, specFn, origFn, beforeFn, beforeFnArgs, afterFn, afterFnArgs, cid, repeatTest) {
    return origFn(specTitle, function (...specFnArgs) {
        return testFnWrapper_1.testFnWrapper.call(this, 'Test', {
            specFn,
            specFnArgs: utils_1.filterSpecArgs(specFnArgs)
        }, {
            beforeFn,
            beforeFnArgs
        }, {
            afterFn,
            afterFnArgs
        }, cid, repeatTest);
    });
};
exports.wrapTestFunction = function (origFn, isSpec, beforeFn, beforeArgsFn, afterFn, afterArgsFn, cid) {
    return function (...specArguments) {
        let retryCnt = typeof specArguments[specArguments.length - 1] === 'number' ? specArguments.pop() : 0;
        const specFn = typeof specArguments[0] === 'function' ? specArguments.shift()
            : (typeof specArguments[1] === 'function' ? specArguments.pop() : undefined);
        const specTitle = specArguments[0];
        if (isSpec) {
            if (specFn) {
                return exports.runSpec(specTitle, specFn, origFn, beforeFn, beforeArgsFn, afterFn, afterArgsFn, cid, retryCnt);
            }
            return origFn(specTitle);
        }
        return exports.runHook(specFn, origFn, beforeFn, beforeArgsFn, afterFn, afterArgsFn, cid, retryCnt);
    };
};
exports.runTestInFiberContext = function (isSpec, beforeFn, beforeArgsFn, afterFn, afterArgsFn, fnName, cid, scope = global) {
    const origFn = scope[fnName];
    scope[fnName] = exports.wrapTestFunction(origFn, isSpec, beforeFn, beforeArgsFn, afterFn, afterArgsFn, cid);
    addMochaCommands(origFn, scope[fnName]);
};
function addMochaCommands(origFn, newFn) {
    MOCHA_COMMANDS.forEach((commandName) => {
        if (typeof origFn[commandName] === 'function') {
            newFn[commandName] = origFn[commandName];
        }
    });
}
