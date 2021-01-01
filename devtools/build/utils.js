"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchDebug = exports.findByWhich = exports.uniq = exports.sort = exports.getPages = exports.getStaleElementError = exports.transformExecuteResult = exports.transformExecuteArgs = exports.sanitizeError = exports.findElements = exports.findElement = exports.getPrototype = exports.validate = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const logger_1 = __importDefault(require("@wdio/logger"));
const utils_1 = require("@wdio/utils");
const protocols_1 = require("@wdio/protocols");
const cleanUpSerializationSelector_1 = __importDefault(require("./scripts/cleanUpSerializationSelector"));
const constants_1 = require("./constants");
const log = logger_1.default('devtools');
exports.validate = function (command, parameters, variables, ref, args) {
    const commandParams = [...variables.map((v) => Object.assign(v, {
            required: true,
            type: 'string'
        })), ...parameters];
    const commandUsage = `${command}(${commandParams.map((p) => p.name).join(', ')})`;
    const moreInfo = `\n\nFor more info see ${ref}\n`;
    const body = {};
    const minAllowedParams = commandParams.filter((param) => param.required).length;
    if (args.length < minAllowedParams || args.length > commandParams.length) {
        const parameterDescription = commandParams.length
            ? `\n\nProperty Description:\n${commandParams.map((p) => `  "${p.name}" (${p.type}): ${p.description}`).join('\n')}`
            : '';
        throw new Error(`Wrong parameters applied for ${command}\n` +
            `Usage: ${commandUsage}` +
            parameterDescription +
            moreInfo);
    }
    for (const [i, arg] of Object.entries(args)) {
        const commandParam = commandParams[parseInt(i, 10)];
        if (!utils_1.isValidParameter(arg, commandParam.type)) {
            if (typeof arg === 'undefined' && !commandParam.required) {
                continue;
            }
            throw new Error(`Malformed type for "${commandParam.name}" parameter of command ${command}\n` +
                `Expected: ${commandParam.type}\n` +
                `Actual: ${utils_1.getArgumentType(arg)}` +
                moreInfo);
        }
        body[commandParams[parseInt(i, 10)].name] = arg;
    }
    log.info('COMMAND', utils_1.commandCallStructure(command, args));
    return body;
};
function getPrototype(commandWrapper) {
    const prototype = {};
    for (const [endpoint, methods] of Object.entries(protocols_1.WebDriverProtocol)) {
        for (const [method, commandData] of Object.entries(methods)) {
            prototype[commandData.command] = { value: commandWrapper(method, endpoint, commandData) };
        }
    }
    return prototype;
}
exports.getPrototype = getPrototype;
async function findElement(context, using, value) {
    const implicitTimeout = this.timeouts.get('implicit');
    const waitForFn = using === 'xpath' ? context.waitForXPath : context.waitForSelector;
    if (implicitTimeout && waitForFn) {
        await waitForFn.call(context, value, { timeout: implicitTimeout });
    }
    let element;
    try {
        element = using === 'xpath'
            ? (await context.$x(value))[0]
            : await context.$(value);
    }
    catch (err) {
        if (!err.message.includes('failed to find element')) {
            throw err;
        }
    }
    if (!element) {
        return new Error(`Element with selector "${value}" not found`);
    }
    const elementId = this.elementStore.set(element);
    return { [constants_1.ELEMENT_KEY]: elementId };
}
exports.findElement = findElement;
async function findElements(context, using, value) {
    const implicitTimeout = this.timeouts.get('implicit');
    const waitForFn = using === 'xpath' ? context.waitForXPath : context.waitForSelector;
    if (implicitTimeout && waitForFn) {
        await waitForFn.call(context, value, { timeout: implicitTimeout });
    }
    const elements = using === 'xpath'
        ? await context.$x(value)
        : await context.$$(value);
    if (elements.length === 0) {
        return [];
    }
    return elements.map((element) => ({
        [constants_1.ELEMENT_KEY]: this.elementStore.set(element)
    }));
}
exports.findElements = findElements;
function sanitizeError(err) {
    let errorMessage = err.message;
    if (err.message.includes('Node is detached from document')) {
        err.name = constants_1.ERROR_MESSAGES.staleElement.name;
        errorMessage = constants_1.ERROR_MESSAGES.staleElement.message;
    }
    const stack = err.stack ? err.stack.split('\n') : [];
    const asyncStack = stack.lastIndexOf('  -- ASYNC --');
    err.stack = errorMessage + '\n' + stack.slice(asyncStack + 1)
        .filter((line) => !line.includes('devtools/node_modules/puppeteer-core'))
        .join('\n');
    return err;
}
exports.sanitizeError = sanitizeError;
async function transformExecuteArgs(args = []) {
    return Promise.all(args.map(async (arg) => {
        if (arg[constants_1.ELEMENT_KEY]) {
            const elementHandle = await this.elementStore.get(arg[constants_1.ELEMENT_KEY]);
            if (!elementHandle) {
                throw getStaleElementError(arg[constants_1.ELEMENT_KEY]);
            }
            arg = elementHandle;
        }
        return arg;
    }));
}
exports.transformExecuteArgs = transformExecuteArgs;
async function transformExecuteResult(page, result) {
    const isResultArray = Array.isArray(result);
    let tmpResult = isResultArray ? result : [result];
    if (tmpResult.find((r) => typeof r === 'string' && r.startsWith(constants_1.SERIALIZE_FLAG))) {
        tmpResult = await Promise.all(tmpResult.map(async (r) => {
            if (typeof r === 'string' && r.startsWith(constants_1.SERIALIZE_FLAG)) {
                return findElement.call(this, page, 'css selector', `[${constants_1.SERIALIZE_PROPERTY}="${r}"]`);
            }
            return result;
        }));
        await page.$$eval(`[${constants_1.SERIALIZE_PROPERTY}]`, cleanUpSerializationSelector_1.default, constants_1.SERIALIZE_PROPERTY);
    }
    return isResultArray ? tmpResult : tmpResult[0];
}
exports.transformExecuteResult = transformExecuteResult;
function getStaleElementError(elementId) {
    const error = new Error(`stale element reference: The element with reference ${elementId} is stale; either the ` +
        'element is no longer attached to the DOM, it is not in the current frame context, or the ' +
        'document has been refreshed');
    error.name = 'stale element reference';
    return error;
}
exports.getStaleElementError = getStaleElementError;
async function getPages(browser, retryInterval = 100) {
    const pages = await browser.pages();
    if (pages.length === 0) {
        log.info('no browser pages found, retrying...');
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
        return getPages(browser);
    }
    return pages;
}
exports.getPages = getPages;
function sort(installations, priorities) {
    const defaultPriority = 10;
    return installations
        .map((inst) => {
        for (const pair of priorities) {
            if (pair.regex.test(inst)) {
                return { path: inst, weight: pair.weight };
            }
        }
        return { path: inst, weight: defaultPriority };
    })
        .sort((a, b) => (b.weight - a.weight))
        .map(pair => pair.path);
}
exports.sort = sort;
function uniq(arr) {
    return Array.from(new Set(arr));
}
exports.uniq = uniq;
function findByWhich(executables, priorities) {
    const installations = [];
    executables.forEach((executable) => {
        try {
            const browserPath = child_process_1.execFileSync('which', [executable], { stdio: 'pipe' }).toString().split(/\r?\n/)[0];
            if (utils_1.canAccess(browserPath)) {
                installations.push(browserPath);
            }
        }
        catch (e) {
        }
    });
    return sort(uniq(installations.filter(Boolean)), priorities);
}
exports.findByWhich = findByWhich;
function patchDebug(scoppedLogger) {
    let puppeteerDebugPkg = path_1.default.resolve(path_1.default.dirname(require.resolve('puppeteer-core')), 'node_modules', 'debug');
    if (!fs_1.default.existsSync(puppeteerDebugPkg)) {
        const pkgName = 'debug';
        puppeteerDebugPkg = require.resolve(pkgName);
    }
    require(puppeteerDebugPkg).log = (msg) => {
        if (msg.includes('puppeteer:protocol')) {
            msg = msg.slice(msg.indexOf(constants_1.PPTR_LOG_PREFIX) + constants_1.PPTR_LOG_PREFIX.length).trim();
        }
        scoppedLogger.debug(msg);
    };
}
exports.patchDebug = patchDebug;
