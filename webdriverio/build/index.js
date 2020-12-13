"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevereServiceError = exports.multiremote = exports.attach = exports.remote = void 0;
const logger_1 = __importDefault(require("@wdio/logger"));
const webdriver_1 = __importStar(require("webdriver"));
const config_1 = require("@wdio/config");
const utils_1 = require("@wdio/utils");
const multiremote_1 = __importDefault(require("./multiremote"));
const SevereServiceError_1 = __importDefault(require("./utils/SevereServiceError"));
const constants_1 = require("./constants");
const utils_2 = require("./utils");
const log = logger_1.default('webdriverio');
exports.remote = async function (params = {}, remoteModifier) {
    logger_1.default.setLogLevelsConfig(params.logLevels, params.logLevel);
    const config = config_1.validateConfig(constants_1.WDIO_DEFAULTS, params, Object.keys(webdriver_1.DEFAULTS));
    const automationProtocol = await utils_2.getAutomationProtocol(config);
    const modifier = (client, options) => {
        Object.assign(options, Object.entries(config)
            .reduce((a, [k, v]) => (v == null ? a : { ...a, [k]: v }), {}));
        if (typeof remoteModifier === 'function') {
            client = remoteModifier(client, options);
        }
        options.automationProtocol = automationProtocol;
        return client;
    };
    if (params.user && params.key) {
        params = Object.assign({}, config_1.detectBackend(params), params);
    }
    const prototype = utils_2.getPrototype('browser');
    log.info(`Initiate new session using the ${automationProtocol} protocol`);
    const ProtocolDriver = require(automationProtocol).default;
    await utils_2.updateCapabilities(params, automationProtocol);
    const instance = await ProtocolDriver.newSession(params, modifier, prototype, utils_1.wrapCommand);
    if (params.runner && !utils_2.isStub(automationProtocol)) {
        const origAddCommand = instance.addCommand.bind(instance);
        instance.addCommand = (name, fn, attachToElement) => (origAddCommand(name, utils_1.runFnInFiberContext(fn), attachToElement));
        const origOverwriteCommand = instance.overwriteCommand.bind(instance);
        instance.overwriteCommand = (name, fn, attachToElement) => (origOverwriteCommand(name, utils_1.runFnInFiberContext(fn), attachToElement));
    }
    instance.addLocatorStrategy = utils_2.addLocatorStrategyHandler(instance);
    return instance;
};
exports.attach = function (params) {
    const prototype = utils_2.getPrototype('browser');
    return webdriver_1.default.attachToSession(params, undefined, prototype, utils_1.wrapCommand);
};
exports.multiremote = async function (params, { automationProtocol } = {}) {
    const multibrowser = new multiremote_1.default();
    const browserNames = Object.keys(params);
    await Promise.all(browserNames.map(async (browserName) => {
        const instance = await exports.remote(params[browserName]);
        return multibrowser.addInstance(browserName, instance);
    }));
    const prototype = utils_2.getPrototype('browser');
    const sessionParams = utils_2.isStub(automationProtocol) ? undefined : {
        sessionId: '',
        isW3C: multibrowser.instances[browserNames[0]].isW3C,
        logLevel: multibrowser.instances[browserNames[0]].options.logLevel
    };
    const ProtocolDriver = automationProtocol && utils_2.isStub(automationProtocol)
        ? require(automationProtocol).default
        : webdriver_1.default;
    const driver = ProtocolDriver.attachToSession(sessionParams, multibrowser.modifier.bind(multibrowser), prototype, utils_1.wrapCommand);
    if (!utils_2.isStub(automationProtocol)) {
        const origAddCommand = driver.addCommand.bind(driver);
        driver.addCommand = (name, fn, attachToElement) => {
            origAddCommand(name, utils_1.runFnInFiberContext(fn), attachToElement, Object.getPrototypeOf(multibrowser.baseInstance), multibrowser.instances);
        };
        const origOverwriteCommand = driver.overwriteCommand.bind(driver);
        driver.overwriteCommand = (name, fn, attachToElement) => {
            origOverwriteCommand(name, utils_1.runFnInFiberContext(fn), attachToElement, Object.getPrototypeOf(multibrowser.baseInstance), multibrowser.instances);
        };
    }
    driver.addLocatorStrategy = utils_2.addLocatorStrategyHandler(driver);
    return driver;
};
exports.SevereServiceError = SevereServiceError_1.default;
