"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionError = exports.getEnvironmentVars = exports.CustomRequestError = exports.getErrorFromResponseBody = exports.getPrototype = exports.isSuccessfulResponse = exports.startWebDriverSession = void 0;
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const logger_1 = __importDefault(require("@wdio/logger"));
const protocols_1 = require("@wdio/protocols");
const request_1 = __importDefault(require("./request"));
const command_1 = __importDefault(require("./command"));
const log = logger_1.default('webdriver');
const BROWSER_DRIVER_ERRORS = [
    'unknown command: wd/hub/session',
    'HTTP method not allowed',
    "'POST /wd/hub/session' was not found.",
    'Command not found'
];
async function startWebDriverSession(params) {
    const [w3cCaps, jsonwpCaps] = params.capabilities && params.capabilities.alwaysMatch
        ? [params.capabilities, params.capabilities.alwaysMatch]
        : [{ alwaysMatch: params.capabilities, firstMatch: [{}] }, params.capabilities];
    const sessionRequest = new request_1.default('POST', '/session', {
        capabilities: w3cCaps,
        desiredCapabilities: jsonwpCaps
    });
    let response;
    try {
        response = await sessionRequest.makeRequest(params);
    }
    catch (err) {
        log.error(err);
        const message = exports.getSessionError(err, params);
        throw new Error('Failed to create session.\n' + message);
    }
    const sessionId = response.value.sessionId || response.sessionId;
    params.requestedCapabilities = params.capabilities;
    params.capabilities = response.value.capabilities || response.value;
    return { sessionId, capabilities: params.capabilities };
}
exports.startWebDriverSession = startWebDriverSession;
function isSuccessfulResponse(statusCode, body) {
    if (!body || typeof body.value === 'undefined') {
        log.debug('request failed due to missing body');
        return false;
    }
    if (body.status === 7 && body.value && body.value.message &&
        (body.value.message.toLowerCase().startsWith('no such element') ||
            body.value.message === 'An element could not be located on the page using the given search parameters.' ||
            body.value.message.toLowerCase().startsWith('unable to find element'))) {
        return true;
    }
    if (body.status && body.status !== 0) {
        log.debug(`request failed due to status ${body.status}`);
        return false;
    }
    const hasErrorResponse = body.value && (body.value.error || body.value.stackTrace || body.value.stacktrace);
    if (statusCode === 200 && !hasErrorResponse) {
        return true;
    }
    if (statusCode === 404 && body.value && body.value.error === 'no such element') {
        return true;
    }
    if (hasErrorResponse) {
        log.debug('request failed due to response error:', body.value.error);
        return false;
    }
    return true;
}
exports.isSuccessfulResponse = isSuccessfulResponse;
function getPrototype({ isW3C, isChrome, isMobile, isSauce, isSeleniumStandalone }) {
    const prototype = {};
    const ProtocolCommands = lodash_merge_1.default(isMobile
        ? lodash_merge_1.default({}, protocols_1.JsonWProtocol, protocols_1.WebDriverProtocol)
        : isW3C ? protocols_1.WebDriverProtocol : protocols_1.JsonWProtocol, isMobile ? lodash_merge_1.default({}, protocols_1.MJsonWProtocol, protocols_1.AppiumProtocol) : {}, isChrome ? protocols_1.ChromiumProtocol : {}, isSauce ? protocols_1.SauceLabsProtocol : {}, isSeleniumStandalone ? protocols_1.SeleniumProtocol : {});
    for (const [endpoint, methods] of Object.entries(ProtocolCommands)) {
        for (const [method, commandData] of Object.entries(methods)) {
            prototype[commandData.command] = { value: command_1.default(method, endpoint, commandData, isSeleniumStandalone) };
        }
    }
    return prototype;
}
exports.getPrototype = getPrototype;
function getErrorFromResponseBody(body) {
    if (!body) {
        return new Error('Response has empty body');
    }
    if (typeof body === 'string' && body.length) {
        return new Error(body);
    }
    if (typeof body !== 'object' || (!body.value && !body.error)) {
        return new Error('unknown error');
    }
    return new CustomRequestError(body);
}
exports.getErrorFromResponseBody = getErrorFromResponseBody;
class CustomRequestError extends Error {
    constructor(body) {
        const errorObj = body.value || body;
        super(errorObj.message || errorObj.class || 'unknown error');
        if (errorObj.error) {
            this.name = errorObj.error;
        }
        else if (errorObj.message && errorObj.message.includes('stale element reference')) {
            this.name = 'stale element reference';
        }
    }
}
exports.CustomRequestError = CustomRequestError;
function getEnvironmentVars({ isW3C, isMobile, isIOS, isAndroid, isChrome, isSauce, isSeleniumStandalone }) {
    return {
        isW3C: { value: isW3C },
        isMobile: { value: isMobile },
        isIOS: { value: isIOS },
        isAndroid: { value: isAndroid },
        isChrome: { value: isChrome },
        isSauce: { value: isSauce },
        isSeleniumStandalone: { value: isSeleniumStandalone }
    };
}
exports.getEnvironmentVars = getEnvironmentVars;
exports.getSessionError = (err, params = {}) => {
    if (err.code === 'ECONNREFUSED') {
        return `Unable to connect to "${params.protocol}://${params.hostname}:${params.port}${params.path}", make sure browser driver is running on that address.` +
            '\nIf you use services like chromedriver see initialiseServices logs above or in wdio.log file as the service might had problems to start the driver.';
    }
    if (err.message === 'unhandled request') {
        return 'The browser driver couldn\'t start the session. Make sure you have set the "path" correctly!';
    }
    if (!err.message) {
        return 'See wdio.* logs for more information.';
    }
    if (err.message.includes('Whoops! The URL specified routes to this help page.')) {
        return "It seems you are running a Selenium Standalone server and point to a wrong path. Please set `path: '/wd/hub'` in your wdio.conf.js!";
    }
    if (BROWSER_DRIVER_ERRORS.some(m => err && err.message && err.message.includes(m))) {
        return "Make sure to set `path: '/'` in your wdio.conf.js!";
    }
    if (err.message.includes('Bad Request - Invalid Hostname') && err.message.includes('HTTP Error 400')) {
        return "Run edge driver on 127.0.0.1 instead of localhost, ex: --host=127.0.0.1, or set `hostname: 'localhost'` in your wdio.conf.js";
    }
    const w3cCapMessage = '\nMake sure to add vendor prefix like "goog:", "appium:", "moz:", etc to non W3C capabilities.' +
        '\nSee more https://www.w3.org/TR/webdriver/#capabilities';
    if (err.message.includes('Illegal key values seen in w3c capabilities')) {
        return err.message + w3cCapMessage;
    }
    if (err.message === 'Response has empty body') {
        return 'Make sure to connect to valid hostname:port or the port is not in use.' +
            '\nIf you use a grid server ' + w3cCapMessage;
    }
    return err.message;
};
