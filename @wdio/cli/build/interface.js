"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const events_1 = require("events");
const logger_1 = __importDefault(require("@wdio/logger"));
const utils_1 = require("./utils");
const log = logger_1.default('@wdio/cli');
class WDIOCLInterface extends events_1.EventEmitter {
    constructor(_config, totalWorkerCnt, _isWatchMode = false) {
        super();
        this._config = _config;
        this.totalWorkerCnt = totalWorkerCnt;
        this._isWatchMode = _isWatchMode;
        this.result = {
            finished: 0,
            passed: 0,
            retries: 0,
            failed: 0
        };
        this._jobs = new Map();
        this._skippedSpecs = 0;
        this._inDebugMode = false;
        this._start = new Date();
        this._messages = {
            reporter: {},
            debugger: {}
        };
        this.hasAnsiSupport = chalk_1.default.supportsColor.hasBasic;
        this.totalWorkerCnt = totalWorkerCnt;
        this._isWatchMode = _isWatchMode;
        this._specFileRetries = _config.specFileRetries || 0;
        this._specFileRetriesDelay = _config.specFileRetriesDelay || 0;
        this.on('job:start', this.addJob.bind(this));
        this.on('job:end', this.clearJob.bind(this));
        this.setup();
        this.onStart();
    }
    setup() {
        this._jobs = new Map();
        this._start = new Date();
        this.result = {
            finished: 0,
            passed: 0,
            retries: 0,
            failed: 0
        };
        this._messages = {
            reporter: {},
            debugger: {}
        };
    }
    onStart() {
        this.log(chalk_1.default.bold(`\nExecution of ${chalk_1.default.blue(this.totalWorkerCnt)} spec files started at`), this._start.toISOString());
        if (this._inDebugMode) {
            this.log(chalk_1.default.bgYellow.black('DEBUG mode enabled!'));
        }
        if (this._isWatchMode) {
            this.log(chalk_1.default.bgYellow.black('WATCH mode enabled!'));
        }
        this.log('');
    }
    onSpecRunning(rid) {
        this.onJobComplete(rid, this._jobs.get(rid), 0, chalk_1.default.bold.cyan('RUNNING'));
    }
    onSpecRetry(rid, job, retries) {
        const delayMsg = this._specFileRetriesDelay > 0 ? ` after ${this._specFileRetriesDelay}s` : '';
        this.onJobComplete(rid, job, retries, chalk_1.default.bold(chalk_1.default.yellow('RETRYING') + delayMsg));
    }
    onSpecPass(rid, job, retries) {
        this.onJobComplete(rid, job, retries, chalk_1.default.bold.green('PASSED'));
    }
    onSpecFailure(rid, job, retries) {
        this.onJobComplete(rid, job, retries, chalk_1.default.bold.red('FAILED'));
    }
    onSpecSkip(rid, job) {
        this.onJobComplete(rid, job, 0, 'SKIPPED', log.info);
    }
    onJobComplete(cid, job, retries = 0, message = '', _logger = this.log) {
        const details = [`[${cid}]`, message];
        if (job) {
            details.push('in', utils_1.getRunnerName(job.caps), this.getFilenames(job.specs));
        }
        if (retries > 0) {
            details.push(`(${retries} retries)`);
        }
        return _logger(...details);
    }
    onTestError(payload) {
        var _a, _b, _c;
        const error = {
            type: ((_a = payload.error) === null || _a === void 0 ? void 0 : _a.type) || 'Error',
            message: ((_b = payload.error) === null || _b === void 0 ? void 0 : _b.message) || (typeof payload.error === 'string' ? payload.error : 'Unknown error.'),
            stack: (_c = payload.error) === null || _c === void 0 ? void 0 : _c.stack
        };
        return this.log(`[${payload.cid}]`, `${chalk_1.default.red(error.type)} in "${payload.fullTitle}"\n${chalk_1.default.red(error.stack || error.message)}`);
    }
    getFilenames(specs = []) {
        if (specs.length > 0) {
            return '- ' + specs.join(', ').replace(new RegExp(`${process.cwd()}`, 'g'), '');
        }
        return '';
    }
    addJob({ cid, caps, specs, hasTests }) {
        this._jobs.set(cid, { caps, specs, hasTests });
        if (hasTests) {
            this.onSpecRunning(cid);
        }
        else {
            this._skippedSpecs++;
        }
    }
    clearJob({ cid, passed, retries }) {
        const job = this._jobs.get(cid);
        this._jobs.delete(cid);
        const retryAttempts = this._specFileRetries - retries;
        const retry = !passed && retries > 0;
        if (!retry) {
            this.result.finished++;
        }
        if (job && job.hasTests === false) {
            return this.onSpecSkip(cid, job);
        }
        if (!job) {
            throw new Error('Could not find job');
        }
        if (passed) {
            this.result.passed++;
            this.onSpecPass(cid, job, retryAttempts);
        }
        else if (retry) {
            this.totalWorkerCnt++;
            this.result.retries++;
            this.onSpecRetry(cid, job, retryAttempts);
        }
        else {
            this.result.failed++;
            this.onSpecFailure(cid, job, retryAttempts);
        }
    }
    log(...args) {
        console.log(...args);
        return args;
    }
    onMessage(event) {
        if (event.origin === 'debugger' && event.name === 'start') {
            this.log(chalk_1.default.yellow(event.params.introMessage));
            this._inDebugMode = true;
            return this._inDebugMode;
        }
        if (event.origin === 'debugger' && event.name === 'stop') {
            this._inDebugMode = false;
            return this._inDebugMode;
        }
        if (event.name === 'testFrameworkInit') {
            return this.emit('job:start', event.content);
        }
        if (!event.origin) {
            return log.warn(`Can't identify message from worker: ${JSON.stringify(event)}, ignoring!`);
        }
        if (event.origin === 'worker' && event.name === 'error') {
            return this.log(`[${event.cid}]`, chalk_1.default.white.bgRed.bold(' Error: '), event.content.message || event.content.stack || event.content);
        }
        if (event.origin !== 'reporter' && event.origin !== 'debugger') {
            return this.log(event.cid, event.origin, event.name, event.content);
        }
        if (event.name === 'printFailureMessage') {
            return this.onTestError(event.content);
        }
        if (!this._messages[event.origin][event.name]) {
            this._messages[event.origin][event.name] = [];
        }
        this._messages[event.origin][event.name].push(event.content);
        if (this._isWatchMode) {
            this.printReporters();
        }
    }
    sigintTrigger() {
        if (this._inDebugMode) {
            return false;
        }
        const isRunning = this._jobs.size !== 0;
        const shutdownMessage = isRunning
            ? 'Ending WebDriver sessions gracefully ...\n' +
                '(press ctrl+c again to hard kill the runner)'
            : 'Ended WebDriver sessions gracefully after a SIGINT signal was received!';
        return this.log('\n\n' + shutdownMessage);
    }
    printReporters() {
        const reporter = this._messages.reporter;
        this._messages.reporter = {};
        for (const [reporterName, messages] of Object.entries(reporter)) {
            this.log('\n', chalk_1.default.bold.magenta(`"${reporterName}" Reporter:`));
            this.log(messages.join(''));
        }
    }
    printSummary() {
        const totalJobs = this.totalWorkerCnt - this.result.retries;
        const elapsed = (new Date(Date.now() - this._start.getTime())).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
        const retries = this.result.retries ? chalk_1.default.yellow(this.result.retries, 'retries') + ', ' : '';
        const failed = this.result.failed ? chalk_1.default.red(this.result.failed, 'failed') + ', ' : '';
        const skipped = this._skippedSpecs > 0 ? chalk_1.default.gray(this._skippedSpecs, 'skipped') + ', ' : '';
        const percentCompleted = totalJobs ? Math.round(this.result.finished / totalJobs * 100) : 0;
        return this.log('\nSpec Files:\t', chalk_1.default.green(this.result.passed, 'passed') + ', ' + retries + failed + skipped + totalJobs, 'total', `(${percentCompleted}% completed)`, 'in', elapsed, '\n');
    }
    finalise() {
        if (this._isWatchMode) {
            return;
        }
        this.printReporters();
        this.printSummary();
    }
}
exports.default = WDIOCLInterface;
