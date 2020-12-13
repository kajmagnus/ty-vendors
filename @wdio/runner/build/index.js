"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const events_1 = __importDefault(require("events"));
const logger_1 = __importDefault(require("@wdio/logger"));
const utils_1 = require("@wdio/utils");
const config_1 = require("@wdio/config");
const reporter_1 = __importDefault(require("./reporter"));
const utils_2 = require("./utils");
const log = logger_1.default('@wdio/runner');
class Runner extends events_1.default {
    constructor() {
        super();
        this.configParser = new config_1.ConfigParser();
        this.sigintWasCalled = false;
    }
    async run({ cid, args, specs, caps, configFile, retries }) {
        this.cid = cid;
        this.specs = specs;
        this.caps = caps;
        try {
            this.configParser.addConfigFile(configFile);
        }
        catch (e) {
            return this._shutdown(1, retries);
        }
        this.configParser.merge(args);
        this.config = this.configParser.getConfig();
        this.config.specFileRetryAttempts = (this.config.specFileRetries || 0) - (retries || 0);
        logger_1.default.setLogLevelsConfig(this.config.logLevels, this.config.logLevel);
        const isMultiremote = this.isMultiremote = !Array.isArray(this.configParser.getCapabilities());
        let browser = await this._startSession({
            ...this.config,
            _automationProtocol: this.config.automationProtocol,
            automationProtocol: './protocol-stub'
        }, caps);
        utils_1.initialiseWorkerService(this.config, caps, args.ignoredWorkerServices)
            .map(this.configParser.addService.bind(this.configParser));
        await utils_2.runHook('beforeSession', this.config, this.caps, this.specs);
        this.reporter = new reporter_1.default(this.config, this.cid, { ...caps });
        this.framework = utils_1.initialisePlugin(this.config.framework, 'framework').default;
        this.framework = await this.framework.init(cid, this.config, specs, caps, this.reporter);
        process.send({ name: 'testFrameworkInit', content: { cid, caps, specs, hasTests: this.framework.hasTests() } });
        if (!this.framework.hasTests()) {
            return this._shutdown(0, retries);
        }
        browser = await this._initSession(this.config, this.caps, browser);
        this.inWatchMode = Boolean(this.config.watch);
        if (!browser) {
            return this._shutdown(1, retries);
        }
        this.reporter.caps = browser.capabilities;
        await utils_1.executeHooksWithArgs(this.config.before, [this.caps, this.specs, browser]);
        if (this.sigintWasCalled) {
            log.info('SIGINT signal detected while starting session, shutting down...');
            await this.endSession();
            return this._shutdown(0, retries);
        }
        const instances = utils_2.getInstancesData(browser, isMultiremote);
        this.reporter.emit('runner:start', {
            cid,
            specs,
            config: this.config,
            isMultiremote,
            sessionId: browser.sessionId,
            capabilities: isMultiremote
                ? browser.instances.reduce((caps, browserName) => {
                    caps[browserName] = browser[browserName].capabilities;
                    caps[browserName].sessionId = browser[browserName].sessionId;
                    return caps;
                }, {})
                : { ...browser.capabilities, sessionId: browser.sessionId },
            retry: this.config.specFileRetryAttempts
        });
        const { protocol, hostname, port, path, queryParams } = browser.options;
        const { isW3C, sessionId } = browser;
        process.send({
            origin: 'worker',
            name: 'sessionStarted',
            content: { sessionId, isW3C, protocol, hostname, port, path, queryParams, isMultiremote, instances }
        });
        let failures = 0;
        try {
            failures = await this.framework.run();
            await this._fetchDriverLogs(this.config, caps.excludeDriverLogs);
        }
        catch (e) {
            log.error(e);
            this.emit('error', e);
            failures = 1;
        }
        if (!args.watch) {
            await this.endSession();
        }
        return this._shutdown(failures, retries);
    }
    async _initSession(config, caps, browserStub) {
        const browser = await this._startSession(config, caps);
        if (!browser) {
            return null;
        }
        if (browserStub) {
            Object.entries(browserStub).forEach(([key, value]) => {
                if (typeof browser[key] === 'undefined') {
                    browser[key] = value;
                }
            });
        }
        global.$ = (selector) => browser.$(selector);
        global.$$ = (selector) => browser.$$(selector);
        browser.on('command', (command) => this.reporter.emit('client:beforeCommand', Object.assign(command, { sessionId: browser.sessionId })));
        browser.on('result', (result) => this.reporter.emit('client:afterCommand', Object.assign(result, { sessionId: browser.sessionId })));
        return browser;
    }
    async _startSession(config, caps) {
        let browser = null;
        try {
            browser = global.browser = global.driver = await utils_2.initialiseInstance(config, caps, this.isMultiremote);
        }
        catch (e) {
            log.error(e);
            this.emit('error', e);
            return browser;
        }
        browser.config = config;
        return browser;
    }
    async _fetchDriverLogs(config, excludeDriverLogs) {
        if (!config.outputDir ||
            !global.browser.sessionId ||
            typeof global.browser.getLogs === 'undefined') {
            return;
        }
        global._HAS_FIBER_CONTEXT = true;
        let logTypes;
        try {
            logTypes = await global.browser.getLogTypes();
        }
        catch (errIgnored) {
            return;
        }
        logTypes = utils_2.filterLogTypes(excludeDriverLogs, logTypes);
        log.debug(`Fetching logs for ${logTypes.join(', ')}`);
        return Promise.all(logTypes.map(async (logType) => {
            let logs;
            try {
                logs = await global.browser.getLogs(logType);
            }
            catch (e) {
                return log.warn(`Couldn't fetch logs for ${logType}: ${e.message}`);
            }
            if (logs.length === 0) {
                return;
            }
            const stringLogs = logs.map((log) => JSON.stringify(log)).join('\n');
            return util_1.default.promisify(fs_1.default.writeFile)(path_1.default.join(config.outputDir, `wdio-${this.cid}-${logType}.log`), stringLogs, 'utf-8');
        }));
    }
    async _shutdown(failures, retries) {
        this.reporter.emit('runner:end', {
            failures,
            cid: this.cid,
            retries
        });
        try {
            await this.reporter.waitForSync();
        }
        catch (e) {
            log.error(e);
        }
        this.emit('exit', failures === 0 ? 0 : 1);
        return failures;
    }
    async endSession() {
        const hasSessionId = global.browser && (this.isMultiremote
            ? !global.browser.instances.some(i => global.browser[i] && !global.browser[i].sessionId)
            : global.browser.sessionId);
        if (!hasSessionId) {
            return;
        }
        let capabilities = global.browser.capabilities || {};
        if (this.isMultiremote) {
            global.browser.instances.forEach(i => { capabilities[i] = global.browser[i].capabilities; });
        }
        await global.browser.deleteSession();
        if (this.isMultiremote) {
            global.browser.instances.forEach(i => { delete global.browser[i].sessionId; });
        }
        else {
            delete global.browser.sessionId;
        }
        await utils_2.runHook('afterSession', global.browser.config, capabilities, this.specs);
    }
}
exports.default = Runner;
