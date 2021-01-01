"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reporter_1 = __importDefault(require("@wdio/reporter"));
const chalk_1 = __importDefault(require("chalk"));
const pretty_ms_1 = __importDefault(require("pretty-ms"));
const utils_1 = require("./utils");
class SpecReporter extends reporter_1.default {
    constructor(options) {
        var _a, _b, _c;
        options = Object.assign({ stdout: true }, options);
        super(options);
        this.symbols = {
            passed: ((_a = options.symbols) === null || _a === void 0 ? void 0 : _a.passed) || '✓',
            skipped: ((_b = options.symbols) === null || _b === void 0 ? void 0 : _b.skipped) || '-',
            failed: ((_c = options.symbols) === null || _c === void 0 ? void 0 : _c.failed) || '✖'
        };
        this.suiteUids = [];
        this.suites = [];
        this.indents = 0;
        this.suiteIndents = {};
        this.defaultTestIndent = '   ';
        this.stateCounts = {
            passed: 0,
            failed: 0,
            skipped: 0
        };
        this.chalk = chalk_1.default;
    }
    onSuiteStart(suite) {
        this.suiteUids.push(suite.uid);
        this.suiteIndents[suite.uid] = ++this.indents;
    }
    onSuiteEnd(suite) {
        this.indents--;
        this.suites.push(suite);
    }
    onHookEnd(hook) {
        if (hook.error) {
            this.stateCounts.failed++;
        }
    }
    onTestPass() {
        this.stateCounts.passed++;
    }
    onTestFail() {
        this.stateCounts.failed++;
    }
    onTestSkip() {
        this.stateCounts.skipped++;
    }
    onRunnerEnd(runner) {
        this.printReport(runner);
    }
    printReport(runner) {
        const duration = `(${pretty_ms_1.default(runner._duration)})`;
        const preface = `[${this.getEnviromentCombo(runner.capabilities, false, runner.isMultiremote).trim()} #${runner.cid}]`;
        const divider = '------------------------------------------------------------------';
        const results = this.getResultDisplay();
        if (results.length === 0) {
            return;
        }
        const testLinks = runner.isMultiremote
            ? Object.entries(runner.capabilities).map(([instanceName, capabilities]) => this.getTestLink({
                config: { ...runner.config, ...{ capabilities } },
                sessionId: capabilities.sessionId,
                isMultiremote: runner.isMultiremote,
                instanceName
            }))
            : this.getTestLink(runner);
        const output = [
            ...this.getHeaderDisplay(runner),
            '',
            ...results,
            ...this.getCountDisplay(duration),
            ...this.getFailureDisplay(),
            ...(testLinks.length
                ? ['', ...testLinks]
                : [])
        ];
        const prefacedOutput = output.map((value) => {
            return value ? `${preface} ${value}` : preface;
        });
        this.write(`${divider}\n${prefacedOutput.join('\n')}\n`);
    }
    getTestLink({ config, sessionId, isMultiremote, instanceName }) {
        const isSauceJob = ((config.hostname && config.hostname.includes('saucelabs')) ||
            config.capabilities && (config.capabilities['sauce:options'] ||
                config.capabilities.tunnelIdentifier));
        if (isSauceJob) {
            const dc = config.headless
                ? '.us-east-1'
                : ['eu', 'eu-central-1'].includes(config.region) ? '.eu-central-1' : '';
            const multiremoteNote = isMultiremote ? ` ${instanceName}` : '';
            return [`Check out${multiremoteNote} job at https://app${dc}.saucelabs.com/tests/${sessionId}`];
        }
        return [];
    }
    getHeaderDisplay(runner) {
        const combo = this.getEnviromentCombo(runner.capabilities, undefined, runner.isMultiremote).trim();
        const output = [
            `Spec: ${runner.specs[0]}`,
            `Running: ${combo}`
        ];
        if (runner.capabilities.sessionId) {
            output.push(`Session ID: ${runner.capabilities.sessionId}`);
        }
        return output;
    }
    getEventsToReport(suite) {
        return [
            ...suite.hooksAndTests
                .filter((item) => {
                return item.type === 'test' || Boolean(item.error);
            })
        ];
    }
    getResultDisplay() {
        const output = [];
        const suites = this.getOrderedSuites();
        for (const suite of suites) {
            if (suite.tests.length === 0 && suite.suites.length === 0 && suite.hooks.length === 0) {
                continue;
            }
            const suiteIndent = this.indent(suite.uid);
            output.push(`${suiteIndent}${suite.title}`);
            if (suite.description) {
                output.push(...suite.description.trim().split('\n')
                    .map((l) => `${suiteIndent}${this.chalk.grey(l.trim())}`));
                output.push('');
            }
            const eventsToReport = this.getEventsToReport(suite);
            for (const test of eventsToReport) {
                const testTitle = test.title;
                const state = test.state;
                const testIndent = `${this.defaultTestIndent}${suiteIndent}`;
                output.push(`${testIndent}${this.chalk[this.getColor(state)](this.getSymbol(state))} ${testTitle}`);
                if (test.argument && test.argument.rows && test.argument.rows.length) {
                    const data = utils_1.buildTableData(test.argument.rows);
                    const rawTable = utils_1.printTable(data);
                    const table = utils_1.getFormattedRows(rawTable, testIndent);
                    output.push(...table);
                }
            }
            if (eventsToReport.length) {
                output.push('');
            }
        }
        return output;
    }
    getCountDisplay(duration) {
        const output = [];
        if (this.stateCounts.passed > 0) {
            const text = `${this.stateCounts.passed} passing ${duration}`;
            output.push(this.chalk[this.getColor('passed')](text));
            duration = '';
        }
        if (this.stateCounts.failed > 0) {
            const text = `${this.stateCounts.failed} failing ${duration}`.trim();
            output.push(this.chalk[this.getColor('failed')](text));
            duration = '';
        }
        if (this.stateCounts.skipped > 0) {
            const text = `${this.stateCounts.skipped} skipped ${duration}`.trim();
            output.push(this.chalk[this.getColor('skipped')](text));
        }
        return output;
    }
    getFailureDisplay() {
        let failureLength = 0;
        const output = [];
        const suites = this.getOrderedSuites();
        for (const suite of suites) {
            const suiteTitle = suite.title;
            const eventsToReport = this.getEventsToReport(suite);
            for (const test of eventsToReport) {
                if (test.state !== 'failed') {
                    continue;
                }
                const testTitle = test.title;
                const errors = test.errors || [test.error];
                output.push('', `${++failureLength}) ${suiteTitle} ${testTitle}`);
                for (let error of errors) {
                    output.push(this.chalk.red(error.message));
                    if (error.stack) {
                        output.push(...error.stack.split(/\n/g).map(value => this.chalk.gray(value)));
                    }
                }
            }
        }
        return output;
    }
    getOrderedSuites() {
        if (this.orderedSuites) {
            return this.orderedSuites;
        }
        this.orderedSuites = [];
        for (const uid of this.suiteUids) {
            for (const suite of this.suites) {
                if (suite.uid !== uid) {
                    continue;
                }
                this.orderedSuites.push(suite);
            }
        }
        return this.orderedSuites;
    }
    indent(uid) {
        const indents = this.suiteIndents[uid];
        return indents === 0 ? '' : Array(indents).join('    ');
    }
    getSymbol(state) {
        return this.symbols[state] || '?';
    }
    getColor(state) {
        let color = null;
        switch (state) {
            case 'passed':
                color = 'green';
                break;
            case 'pending':
            case 'skipped':
                color = 'cyan';
                break;
            case 'failed':
                color = 'red';
                break;
        }
        return color;
    }
    getEnviromentCombo(caps, verbose = true, isMultiremote = false) {
        const device = caps.deviceName;
        const browser = isMultiremote ? 'MultiremoteBrowser' : (caps.browserName || caps.browser);
        const version = caps.browserVersion || caps.version || caps.platformVersion || caps.browser_version;
        const platform = caps.platformName || caps.platform || (caps.os ? caps.os + (caps.os_version ? ` ${caps.os_version}` : '') : '(unknown)');
        if (device) {
            const program = (caps.app || '').replace('sauce-storage:', '') || caps.browserName;
            const executing = program ? `executing ${program}` : '';
            if (!verbose) {
                return `${device} ${platform} ${version}`;
            }
            return `${device} on ${platform} ${version} ${executing}`.trim();
        }
        if (!verbose) {
            return (browser + (version ? ` ${version} ` : ' ') + (platform)).trim();
        }
        return browser + (version ? ` (v${version})` : '') + (` on ${platform}`);
    }
}
exports.default = SpecReporter;
