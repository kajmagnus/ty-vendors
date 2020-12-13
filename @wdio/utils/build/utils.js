"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.canAccess = exports.isBase64 = exports.filterSpecArgs = exports.isFunctionAsync = exports.safeRequire = exports.getArgumentType = exports.isValidParameter = exports.transformCommandLogResult = exports.commandCallStructure = exports.overwriteElementCommands = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const SCREENSHOT_REPLACEMENT = '"<Screenshot[base64]>"';
function overwriteElementCommands(propertiesObject) {
    const elementOverrides = propertiesObject['__elementOverrides__'] ? propertiesObject['__elementOverrides__'].value : {};
    for (const [commandName, userDefinedCommand] of Object.entries(elementOverrides)) {
        if (typeof userDefinedCommand !== 'function') {
            throw new Error('overwriteCommand: commands be overwritten only with functions, command: ' + commandName);
        }
        if (!propertiesObject[commandName]) {
            throw new Error('overwriteCommand: no command to be overwritten: ' + commandName);
        }
        if (typeof propertiesObject[commandName].value !== 'function') {
            throw new Error('overwriteCommand: only functions can be overwritten, command: ' + commandName);
        }
        const origCommand = propertiesObject[commandName].value;
        delete propertiesObject[commandName];
        const newCommand = function (...args) {
            const element = this;
            return userDefinedCommand.apply(element, [
                function origCommandFunction() {
                    const context = this || element;
                    return origCommand.apply(context, arguments);
                },
                ...args
            ]);
        };
        propertiesObject[commandName] = {
            value: newCommand,
            configurable: true
        };
    }
    delete propertiesObject['__elementOverrides__'];
    propertiesObject['__elementOverrides__'] = { value: {} };
}
exports.overwriteElementCommands = overwriteElementCommands;
function commandCallStructure(commandName, args) {
    const callArgs = args.map((arg) => {
        if (typeof arg === 'string' && (arg.startsWith('!function(') || arg.startsWith('return (function'))) {
            arg = '<fn>';
        }
        else if (typeof arg === 'string' &&
            !commandName.startsWith('findElement') &&
            isBase64(arg)) {
            arg = SCREENSHOT_REPLACEMENT;
        }
        else if (typeof arg === 'string') {
            arg = `"${arg}"`;
        }
        else if (typeof arg === 'function') {
            arg = '<fn>';
        }
        else if (arg === null) {
            arg = 'null';
        }
        else if (typeof arg === 'object') {
            arg = '<object>';
        }
        else if (typeof arg === 'undefined') {
            arg = typeof arg;
        }
        return arg;
    }).join(', ');
    return `${commandName}(${callArgs})`;
}
exports.commandCallStructure = commandCallStructure;
function transformCommandLogResult(result) {
    if (typeof result.file === 'string' && isBase64(result.file)) {
        return SCREENSHOT_REPLACEMENT;
    }
    return result;
}
exports.transformCommandLogResult = transformCommandLogResult;
function isValidParameter(arg, expectedType) {
    let shouldBeArray = false;
    if (expectedType.slice(-2) === '[]') {
        expectedType = expectedType.slice(0, -2);
        shouldBeArray = true;
    }
    if (shouldBeArray) {
        if (!Array.isArray(arg)) {
            return false;
        }
    }
    else {
        arg = [arg];
    }
    for (const argEntity of arg) {
        const argEntityType = getArgumentType(argEntity);
        if (!argEntityType.match(expectedType)) {
            return false;
        }
    }
    return true;
}
exports.isValidParameter = isValidParameter;
function getArgumentType(arg) {
    return arg === null ? 'null' : typeof arg;
}
exports.getArgumentType = getArgumentType;
function safeRequire(name) {
    var _a, _b, _c;
    let requirePath;
    try {
        const localNodeModules = path_1.default.join(process.cwd(), '/node_modules');
        if (!((_a = require === null || require === void 0 ? void 0 : require.main) === null || _a === void 0 ? void 0 : _a.paths.includes(localNodeModules))) {
            (_b = require === null || require === void 0 ? void 0 : require.main) === null || _b === void 0 ? void 0 : _b.paths.push(localNodeModules);
            const requireOpts = process.env.JEST_WORKER_ID
                ? {}
                : { paths: (_c = require === null || require === void 0 ? void 0 : require.main) === null || _c === void 0 ? void 0 : _c.paths };
            requirePath = require.resolve(name, requireOpts);
        }
        else {
            requirePath = require.resolve(name);
        }
    }
    catch (e) {
        return null;
    }
    try {
        return require(requirePath);
    }
    catch (e) {
        throw new Error(`Couldn't initialise "${name}".\n${e.stack}`);
    }
}
exports.safeRequire = safeRequire;
function isFunctionAsync(fn) {
    return (fn.constructor && fn.constructor.name === 'AsyncFunction') || fn.name === 'async';
}
exports.isFunctionAsync = isFunctionAsync;
function filterSpecArgs(args) {
    return args.filter((arg) => typeof arg !== 'function');
}
exports.filterSpecArgs = filterSpecArgs;
function isBase64(str) {
    var notBase64 = new RegExp('[^A-Z0-9+\\/=]', 'i');
    if (typeof str !== 'string') {
        throw new Error('Expected string but received invalid type.');
    }
    const len = str.length;
    if (!len || len % 4 !== 0 || notBase64.test(str)) {
        return false;
    }
    const firstPaddingChar = str.indexOf('=');
    return firstPaddingChar === -1 ||
        firstPaddingChar === len - 1 ||
        (firstPaddingChar === len - 2 && str[len - 1] === '=');
}
exports.isBase64 = isBase64;
exports.canAccess = (file) => {
    if (!file) {
        return false;
    }
    try {
        fs_1.default.accessSync(file);
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.sleep = (ms = 0) => new Promise((r) => setTimeout(r, ms));
