"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULTS = exports.getPrototype = void 0;
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("@wdio/logger"));
const utils_1 = require("@wdio/utils");
const config_1 = require("@wdio/config");
const constants_1 = require("./constants");
Object.defineProperty(exports, "DEFAULTS", { enumerable: true, get: function () { return constants_1.DEFAULTS; } });
const utils_2 = require("./utils");
Object.defineProperty(exports, "getPrototype", { enumerable: true, get: function () { return utils_2.getPrototype; } });
const log = logger_1.default('webdriver');
class WebDriver {
    static async newSession(options = {}, modifier, userPrototype = {}, customCommandWrapper) {
        const params = config_1.validateConfig(constants_1.DEFAULTS, options);
        if (!options.logLevels || !options.logLevels.webdriver) {
            logger_1.default.setLevel('webdriver', params.logLevel);
        }
        const { directConnectProtocol, directConnectHost, directConnectPort, directConnectPath } = params;
        if (directConnectProtocol && directConnectHost && directConnectPort && (directConnectPath || directConnectPath === '')) {
            log.info('Found direct connect information in new session response. ' +
                `Will connect to server at ${directConnectProtocol}://${directConnectHost}:${directConnectPort}/${directConnectPath}`);
            params.protocol = directConnectProtocol;
            params.hostname = directConnectHost;
            params.port = directConnectPort;
            params.path = directConnectPath;
        }
        if (params.outputDir) {
            process.env.WDIO_LOG_PATH = path_1.default.join(params.outputDir, 'wdio.log');
        }
        const { sessionId, capabilities } = await utils_2.startWebDriverSession(params);
        const environment = utils_1.sessionEnvironmentDetector({ capabilities, requestedCapabilities: params.requestedCapabilities });
        const environmentPrototype = utils_2.getEnvironmentVars(environment);
        const protocolCommands = utils_2.getPrototype(environment);
        const prototype = { ...protocolCommands, ...environmentPrototype, ...userPrototype };
        const monad = utils_1.webdriverMonad(params, modifier, prototype);
        return monad(sessionId, customCommandWrapper);
    }
    static attachToSession(options, modifier, userPrototype = {}, commandWrapper) {
        if (!options || typeof options.sessionId !== 'string') {
            throw new Error('sessionId is required to attach to existing session');
        }
        if (options.logLevel !== undefined) {
            logger_1.default.setLevel('webdriver', options.logLevel);
        }
        options.capabilities = options.capabilities || {};
        options.isW3C = options.isW3C === false ? false : true;
        const environmentPrototype = utils_2.getEnvironmentVars(options);
        const protocolCommands = utils_2.getPrototype(options);
        const prototype = { ...protocolCommands, ...environmentPrototype, ...userPrototype };
        const monad = utils_1.webdriverMonad(options, modifier, prototype);
        return monad(options.sessionId, commandWrapper);
    }
    static async reloadSession(instance) {
        const params = {
            ...instance.options,
            capabilities: instance.requestedCapabilities
        };
        const { sessionId, capabilities } = await utils_2.startWebDriverSession(params);
        instance.sessionId = sessionId;
        instance.capabilities = capabilities;
        return sessionId;
    }
    static get WebDriver() {
        return WebDriver;
    }
}
exports.default = WebDriver;
