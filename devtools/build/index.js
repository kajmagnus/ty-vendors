"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORTED_BROWSER = exports.sessionMap = void 0;
const os_1 = __importDefault(require("os"));
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
const uuid_1 = require("uuid");
const logger_1 = __importDefault(require("@wdio/logger"));
const utils_1 = require("@wdio/utils");
const config_1 = require("@wdio/config");
const devtoolsdriver_1 = __importDefault(require("./devtoolsdriver"));
const launcher_1 = __importDefault(require("./launcher"));
const constants_1 = require("./constants");
Object.defineProperty(exports, "SUPPORTED_BROWSER", { enumerable: true, get: function () { return constants_1.SUPPORTED_BROWSER; } });
const utils_2 = require("./utils");
const log = logger_1.default('devtools:puppeteer');
utils_2.patchDebug(log);
exports.sessionMap = new Map();
class DevTools {
    static async newSession(options = {}, modifier, userPrototype = {}, customCommandWrapper) {
        var _a, _b;
        const params = config_1.validateConfig(constants_1.DEFAULTS, options);
        if (params.logLevel && (!options.logLevels || !options.logLevels['devtools'])) {
            logger_1.default.setLevel('devtools', params.logLevel);
        }
        const browser = await launcher_1.default(params.capabilities);
        const pages = await browser.pages();
        const driver = new devtoolsdriver_1.default(browser, pages);
        const sessionId = uuid_1.v4();
        const uaParser = new ua_parser_js_1.default(await browser.userAgent());
        const userAgent = uaParser.getResult();
        const availableVendorPrefixes = Object.values(constants_1.VENDOR_PREFIX);
        const vendorCapPrefix = Object.keys(params.capabilities)
            .find((capKey) => availableVendorPrefixes.includes(capKey));
        params.requestedCapabilities = { ...params.capabilities };
        params.capabilities = {
            browserName: userAgent.browser.name,
            browserVersion: userAgent.browser.version,
            platformName: os_1.default.platform(),
            platformVersion: os_1.default.release()
        };
        if (vendorCapPrefix) {
            Object.assign(params.capabilities, {
                [vendorCapPrefix]: Object.assign({ debuggerAddress: browser._connection.url().split('/')[2] }, params.capabilities[vendorCapPrefix])
            });
        }
        exports.sessionMap.set(sessionId, { browser, session: driver });
        const environmentPrototype = { puppeteer: { value: browser } };
        Object.entries(utils_1.devtoolsEnvironmentDetector({
            browserName: (_b = (_a = userAgent === null || userAgent === void 0 ? void 0 : userAgent.browser) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()
        })).forEach(([name, value]) => {
            environmentPrototype[name] = { value };
        });
        const commandWrapper = (method, endpoint, commandInfo) => driver.register(commandInfo);
        const protocolCommands = utils_2.getPrototype(commandWrapper);
        const prototype = {
            ...protocolCommands,
            ...userPrototype,
            ...environmentPrototype
        };
        const monad = utils_1.webdriverMonad(params, modifier, prototype);
        return monad(sessionId, customCommandWrapper);
    }
    static async reloadSession(instance) {
        const { session } = exports.sessionMap.get(instance.sessionId);
        const browser = await launcher_1.default(instance.requestedCapabilities);
        const pages = await browser.pages();
        session.elementStore.clear();
        session.windows = new Map();
        session.browser = browser;
        for (const page of pages) {
            const pageId = uuid_1.v4();
            session.windows.set(pageId, page);
            session.currentWindowHandle = pageId;
        }
        exports.sessionMap.set(instance.sessionId, { browser, session });
        return instance.sessionId;
    }
    static attachToSession() {
        throw new Error('not yet implemented');
    }
}
exports.default = DevTools;
