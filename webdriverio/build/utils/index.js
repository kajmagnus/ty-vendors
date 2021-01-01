"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.containsHeaderObject = exports.updateCapabilities = exports.getAutomationProtocol = exports.isStub = exports.enhanceElementsArray = exports.addLocatorStrategyHandler = exports.hasElementId = exports.getScrollPosition = exports.validateUrl = exports.assertDirectoryExists = exports.getAbsoluteFilepath = exports.getElementRect = exports.verifyArgsAndStripIfElement = exports.findElements = exports.findElement = exports.checkUnicode = exports.parseCSS = exports.transformToCharString = exports.getBrowserObject = exports.getElementFromResponse = exports.getPrototype = void 0;
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const css_value_1 = __importDefault(require("css-value"));
const rgb2hex_1 = __importDefault(require("rgb2hex"));
const get_port_1 = __importDefault(require("get-port"));
const grapheme_splitter_1 = __importDefault(require("grapheme-splitter"));
const logger_1 = __importDefault(require("@wdio/logger"));
const lodash_isobject_1 = __importDefault(require("lodash.isobject"));
const lodash_isplainobject_1 = __importDefault(require("lodash.isplainobject"));
const url_1 = require("url");
const devtools_1 = require("devtools");
const constants_1 = require("../constants");
const findStrategy_1 = require("./findStrategy");
const browserCommands = require('../commands/browser');
const elementCommands = require('../commands/element');
const log = logger_1.default('webdriverio');
const INVALID_SELECTOR_ERROR = 'selector needs to be typeof `string` or `function`';
const scopes = {
    browser: browserCommands,
    element: elementCommands
};
const applyScopePrototype = (prototype, scope) => {
    Object.entries(scopes[scope]).forEach(([commandName, command]) => {
        prototype[commandName] = { value: command };
    });
};
exports.getPrototype = (scope) => {
    const prototype = {
        puppeteer: { value: null, writable: true },
        _NOT_FIBER: { value: false, writable: true, configurable: true }
    };
    applyScopePrototype(prototype, scope);
    prototype.strategies = { value: new Map() };
    return prototype;
};
exports.getElementFromResponse = (res) => {
    if (!res) {
        return null;
    }
    if (res.ELEMENT) {
        return res.ELEMENT;
    }
    if (res[constants_1.ELEMENT_KEY]) {
        return res[constants_1.ELEMENT_KEY];
    }
    return null;
};
function getBrowserObject(elem) {
    const elemObject = elem;
    return elemObject.parent ? getBrowserObject(elemObject.parent) : elem;
}
exports.getBrowserObject = getBrowserObject;
function transformToCharString(value, translateToUnicode = true) {
    const ret = [];
    if (!Array.isArray(value)) {
        value = [value];
    }
    for (const val of value) {
        if (typeof val === 'string') {
            translateToUnicode
                ? ret.push(...checkUnicode(val))
                : ret.push(...`${val}`.split(''));
        }
        else if (typeof val === 'number') {
            const entry = `${val}`.split('');
            ret.push(...entry);
        }
        else if (val && typeof val === 'object') {
            try {
                ret.push(...JSON.stringify(val).split(''));
            }
            catch (e) { }
        }
        else if (typeof val === 'boolean') {
            const entry = val ? 'true'.split('') : 'false'.split('');
            ret.push(...entry);
        }
    }
    return ret;
}
exports.transformToCharString = transformToCharString;
function sanitizeCSS(value) {
    if (!value) {
        return value;
    }
    return value.trim().replace(/'/g, '').replace(/"/g, '').toLowerCase();
}
function parseCSS(cssPropertyValue, cssProperty) {
    var _a;
    const parsedValue = {
        property: cssProperty,
        value: cssPropertyValue.toLowerCase().trim(),
        parsed: {}
    };
    if (((_a = parsedValue.value) === null || _a === void 0 ? void 0 : _a.indexOf('rgb')) === 0) {
        parsedValue.value = parsedValue.value.replace(/\s/g, '');
        let color = parsedValue.value;
        parsedValue.parsed = rgb2hex_1.default(parsedValue.value);
        parsedValue.parsed.type = 'color';
        const colorType = /[rgba]+/g.exec(color) || [];
        parsedValue.parsed[colorType[0]] = color;
    }
    else if (parsedValue.property === 'font-family') {
        let font = css_value_1.default(cssPropertyValue);
        let string = parsedValue.value;
        let value = cssPropertyValue.split(/,/).map(sanitizeCSS);
        parsedValue.value = sanitizeCSS(font[0].value || font[0].string);
        parsedValue.parsed = { value, type: 'font', string };
    }
    else {
        try {
            const value = css_value_1.default(cssPropertyValue);
            if (value.length === 1) {
                parsedValue.parsed = value[0];
            }
            if (parsedValue.parsed.type && parsedValue.parsed.type === 'number' && parsedValue.parsed.unit === '') {
                parsedValue.value = parsedValue.parsed.value;
            }
        }
        catch (e) {
        }
    }
    return parsedValue;
}
exports.parseCSS = parseCSS;
function checkUnicode(value, isDevTools = false) {
    return Object.prototype.hasOwnProperty.call(constants_1.UNICODE_CHARACTERS, value)
        ? isDevTools ? [value] : [constants_1.UNICODE_CHARACTERS[value]]
        : new grapheme_splitter_1.default().splitGraphemes(value);
}
exports.checkUnicode = checkUnicode;
function fetchElementByJSFunction(selector, scope) {
    if (!scope.elementId) {
        return scope.execute(selector);
    }
    const script = (function (elem) {
        return selector.call(elem);
    }).toString().replace('selector', `(${selector.toString()})`);
    return getBrowserObject(scope).execute(`return (${script}).apply(null, arguments)`, scope);
}
async function findElement(selector) {
    if (typeof selector === 'string' || lodash_isplainobject_1.default(selector)) {
        const { using, value } = findStrategy_1.findStrategy(selector, this.isW3C, this.isMobile);
        return this.elementId
            ? this.findElementFromElement(this.elementId, using, value)
            : this.findElement(using, value);
    }
    if (typeof selector === 'function') {
        const notFoundError = new Error(`Function selector "${selector.toString()}" did not return an HTMLElement`);
        let elem = await fetchElementByJSFunction(selector, this);
        elem = Array.isArray(elem) ? elem[0] : elem;
        return exports.getElementFromResponse(elem) ? elem : notFoundError;
    }
    throw new Error(INVALID_SELECTOR_ERROR);
}
exports.findElement = findElement;
async function findElements(selector) {
    if (typeof selector === 'string' || lodash_isplainobject_1.default(selector)) {
        const { using, value } = findStrategy_1.findStrategy(selector, this.isW3C, this.isMobile);
        return this.elementId
            ? this.findElementsFromElement(this.elementId, using, value)
            : this.findElements(using, value);
    }
    if (typeof selector === 'function') {
        const elems = await fetchElementByJSFunction(selector, this);
        const elemArray = Array.isArray(elems) ? elems : [elems];
        return elemArray.filter((elem) => elem && exports.getElementFromResponse(elem));
    }
    throw new Error(INVALID_SELECTOR_ERROR);
}
exports.findElements = findElements;
function verifyArgsAndStripIfElement(args) {
    function verify(arg) {
        if (lodash_isobject_1.default(arg) && arg.constructor.name === 'Element') {
            const elem = arg;
            if (!elem.elementId) {
                throw new Error(`The element with selector "${elem.selector}" you trying to pass into the execute method wasn't found`);
            }
            return {
                [constants_1.ELEMENT_KEY]: elem.elementId,
                ELEMENT: elem.elementId
            };
        }
        return arg;
    }
    return !Array.isArray(args) ? verify(args) : args.map(verify);
}
exports.verifyArgsAndStripIfElement = verifyArgsAndStripIfElement;
async function getElementRect(scope) {
    const rect = await scope.getElementRect(scope.elementId);
    let defaults = { x: 0, y: 0, width: 0, height: 0 };
    if (Object.keys(defaults).some((key) => rect[key] == null)) {
        const rectJs = await getBrowserObject(scope).execute(function (el) {
            if (!el || !el.getBoundingClientRect) {
                return;
            }
            const { left, top, width, height } = el.getBoundingClientRect();
            return {
                x: left + this.scrollX,
                y: top + this.scrollY,
                width,
                height
            };
        }, scope);
        Object.keys(defaults).forEach((key) => {
            if (rect[key] != null) {
                return;
            }
            if (rectJs && typeof rectJs[key] === 'number') {
                rect[key] = Math.floor(rectJs[key]);
            }
            else {
                log.error('getElementRect', { rect, rectJs, key });
                throw new Error('Failed to receive element rects via execute command');
            }
        });
    }
    return rect;
}
exports.getElementRect = getElementRect;
function getAbsoluteFilepath(filepath) {
    return filepath.startsWith('/') || filepath.startsWith('\\') || filepath.match(/^[a-zA-Z]:\\/)
        ? filepath
        : path_1.default.join(process.cwd(), filepath);
}
exports.getAbsoluteFilepath = getAbsoluteFilepath;
function assertDirectoryExists(filepath) {
    if (!fs_1.default.existsSync(path_1.default.dirname(filepath))) {
        throw new Error(`directory (${path_1.default.dirname(filepath)}) doesn't exist`);
    }
}
exports.assertDirectoryExists = assertDirectoryExists;
function validateUrl(url, origError) {
    try {
        const urlObject = new url_1.URL(url);
        return urlObject.href;
    }
    catch (e) {
        if (origError) {
            throw origError;
        }
        return validateUrl(`http://${url}`, e);
    }
}
exports.validateUrl = validateUrl;
function getScrollPosition(scope) {
    return getBrowserObject(scope)
        .execute(function () {
        return { scrollX: this.pageXOffset, scrollY: this.pageYOffset };
    });
}
exports.getScrollPosition = getScrollPosition;
async function hasElementId(element) {
    if (!element.elementId) {
        const method = element.isReactElement ? 'react$' : '$';
        element.elementId = (await element.parent[method](element.selector)).elementId;
    }
    if (!element.elementId) {
        return false;
    }
    return true;
}
exports.hasElementId = hasElementId;
function addLocatorStrategyHandler(scope) {
    return (name, script) => {
        if (scope.strategies.get(name)) {
            throw new Error(`Strategy ${name} already exists`);
        }
        scope.strategies.set(name, script);
    };
}
exports.addLocatorStrategyHandler = addLocatorStrategyHandler;
exports.enhanceElementsArray = (elements, parent, selector, foundWith = '$$', props = []) => {
    elements.parent = parent;
    elements.selector = selector;
    elements.foundWith = foundWith;
    elements.props = props;
    return elements;
};
exports.isStub = (automationProtocol) => automationProtocol === './protocol-stub';
exports.getAutomationProtocol = async (config) => {
    var _a;
    if (config.automationProtocol) {
        return config.automationProtocol;
    }
    if (config.hostname || config.port || config.path || (config.user && config.key)) {
        return 'webdriver';
    }
    if (config.capabilities &&
        typeof config.capabilities.browserName === 'string' &&
        !devtools_1.SUPPORTED_BROWSER.includes((_a = config.capabilities.browserName) === null || _a === void 0 ? void 0 : _a.toLowerCase())) {
        return 'webdriver';
    }
    if (config.capabilities && config.capabilities.alwaysMatch) {
        return 'webdriver';
    }
    const resp = await new Promise((resolve) => {
        const req = http_1.default.request(constants_1.DRIVER_DEFAULT_ENDPOINT, resolve);
        req.on('error', (error) => resolve({ error }));
        req.end();
    });
    const driverEndpointHeaders = resp;
    if (driverEndpointHeaders.req && driverEndpointHeaders.req.agent) {
        driverEndpointHeaders.req.agent.destroy();
    }
    if (driverEndpointHeaders && driverEndpointHeaders.statusCode === 200) {
        return 'webdriver';
    }
    return 'devtools';
};
exports.updateCapabilities = async (params, automationProtocol) => {
    const caps = params.capabilities;
    if (automationProtocol === 'webdriver' && caps.browserName === 'firefox') {
        if (!caps['moz:firefoxOptions']) {
            caps['moz:firefoxOptions'] = {};
        }
        if (!caps['moz:firefoxOptions'].args) {
            caps['moz:firefoxOptions'].args = [];
        }
        if (!caps['moz:firefoxOptions'].args.includes(constants_1.FF_REMOTE_DEBUG_ARG)) {
            caps['moz:firefoxOptions'].args.push(constants_1.FF_REMOTE_DEBUG_ARG, (await get_port_1.default()).toString());
        }
    }
};
exports.containsHeaderObject = (base, match) => {
    for (const [key, value] of Object.entries(match)) {
        if (typeof base[key] === 'undefined' || base[key] !== value) {
            return false;
        }
    }
    return true;
};
