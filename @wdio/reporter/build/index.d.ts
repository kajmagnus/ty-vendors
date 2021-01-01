/// <reference types="node" />
import { WriteStream } from 'fs';
import { EventEmitter } from 'events';
import SuiteStats from './stats/suite';
import HookStats from './stats/hook';
import TestStats from './stats/test';
import RunnerStats from './stats/runner';
import { AfterCommandArgs, BeforeCommandArgs } from './types';
interface WDIOReporterBaseOptions {
    outputDir?: string;
}
export interface WDIOReporterOptionsFromStdout extends WDIOReporterBaseOptions {
    stdout: boolean;
    writeStream: WriteStream;
}
export interface WDIOReporterOptionsFromLogFile extends WDIOReporterBaseOptions {
    logFile: string;
}
export declare type WDIOReporterOptions = WDIOReporterOptionsFromLogFile & WDIOReporterOptionsFromStdout;
export default class WDIOReporter extends EventEmitter {
    options: Partial<WDIOReporterOptions>;
    outputStream: WriteStream;
    failures: number;
    suites: Record<string, SuiteStats>;
    hooks: Record<string, HookStats>;
    tests: Record<string, TestStats>;
    currentSuites: SuiteStats[];
    counts: {
        suites: number;
        tests: number;
        hooks: number;
        passes: number;
        skipping: number;
        failures: number;
    };
    retries: number;
    runnerStat?: RunnerStats;
    isContentPresent: boolean;
    constructor(options: Partial<WDIOReporterOptions>);
    get isSynchronised(): boolean;
    write(content: any): void;
    onRunnerStart(runnerStats: RunnerStats): void;
    onBeforeCommand(commandArgs: BeforeCommandArgs): void;
    onAfterCommand(commandArgs: AfterCommandArgs): void;
    onSuiteStart(suiteStats: SuiteStats): void;
    onHookStart(hookStat: HookStats): void;
    onHookEnd(hookStats: HookStats): void;
    onTestStart(testStats: TestStats): void;
    onTestPass(testStats: TestStats): void;
    onTestFail(testStats: TestStats): void;
    onTestRetry(testStats: TestStats): void;
    onTestSkip(testStats: TestStats): void;
    onTestEnd(testStats: TestStats): void;
    onSuiteEnd(suiteStats: SuiteStats): void;
    onRunnerEnd(runnerStats: RunnerStats): void;
}
export { SuiteStats, HookStats, TestStats, RunnerStats };
//# sourceMappingURL=index.d.ts.map