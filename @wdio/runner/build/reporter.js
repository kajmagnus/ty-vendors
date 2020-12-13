"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("@wdio/logger"));
const utils_1 = require("@wdio/utils");
const utils_2 = require("./utils");
const log = logger_1.default('@wdio/runner');
const NOOP = () => { };
const DEFAULT_SYNC_TIMEOUT = 5000;
const DEFAULT_SYNC_INTERVAL = 100;
class BaseReporter {
    constructor(config, cid, caps) {
        this.config = config;
        this.cid = cid;
        this.caps = caps;
        this.reporterSyncInterval = this.config.reporterSyncInterval || DEFAULT_SYNC_INTERVAL;
        this.reporterSyncTimeout = this.config.reporterSyncTimeout || DEFAULT_SYNC_TIMEOUT;
        this.reporters = config.reporters.map(this.initReporter.bind(this));
    }
    emit(e, payload) {
        payload.cid = this.cid;
        utils_2.sendFailureMessage(e, payload);
        this.reporters.forEach((reporter) => reporter.emit(e, payload));
    }
    getLogFile(name) {
        let options = Object.assign({}, this.config);
        let filename = `wdio-${this.cid}-${name}-reporter.log`;
        const reporterOptions = this.config.reporters.find((reporter) => (Array.isArray(reporter) && (reporter[0] === name ||
            typeof reporter[0] === 'function' && reporter[0].name === name)));
        if (reporterOptions) {
            const fileformat = reporterOptions[1].outputFileFormat;
            options.cid = this.cid;
            options.capabilities = this.caps;
            Object.assign(options, reporterOptions[1]);
            if (fileformat) {
                if (typeof fileformat !== 'function') {
                    throw new Error('outputFileFormat must be a function');
                }
                filename = fileformat(options);
            }
        }
        if (!options.outputDir) {
            return;
        }
        return path_1.default.join(options.outputDir, filename);
    }
    getWriteStreamObject(reporter) {
        return {
            write: (content) => process.send({
                origin: 'reporter',
                name: reporter,
                content
            })
        };
    }
    waitForSync() {
        const startTime = Date.now();
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const unsyncedReporter = this.reporters
                    .filter((reporter) => !reporter.isSynchronised)
                    .map((reporter) => reporter.constructor.name);
                if ((Date.now() - startTime) > this.reporterSyncTimeout && unsyncedReporter.length) {
                    clearInterval(interval);
                    return reject(new Error(`Some reporters are still unsynced: ${unsyncedReporter.join(', ')}`));
                }
                if (!unsyncedReporter.length) {
                    clearInterval(interval);
                    return resolve(true);
                }
                log.info(`Wait for ${unsyncedReporter.length} reporter to synchronise`);
            }, this.reporterSyncInterval);
        });
    }
    initReporter(reporter) {
        let ReporterClass;
        let options = {
            logLevel: this.config.logLevel,
            setLogFile: NOOP
        };
        if (Array.isArray(reporter)) {
            options = Object.assign({}, options, reporter[1]);
            reporter = reporter[0];
        }
        if (typeof reporter === 'function') {
            ReporterClass = reporter;
            const customLogFile = options.setLogFile(this.cid, ReporterClass.name);
            options.logFile = customLogFile || this.getLogFile(ReporterClass.name);
            options.writeStream = this.getWriteStreamObject(ReporterClass.name);
            return new ReporterClass(options);
        }
        if (typeof reporter === 'string') {
            ReporterClass = utils_1.initialisePlugin(reporter, 'reporter').default;
            const customLogFile = options.setLogFile(this.cid, reporter);
            options.logFile = customLogFile || this.getLogFile(reporter);
            options.writeStream = this.getWriteStreamObject(reporter);
            return new ReporterClass(options);
        }
        throw new Error('Invalid reporters config');
    }
}
exports.default = BaseReporter;
