/// <reference types="webdriver" />
/// <reference types="node" />
/// <reference types="webdriverio/webdriverio-core" />
import Mocha from 'mocha';
import type { MochaConfig, MochaOpts, FrameworkMessage, FormattedMessage, MochaContext, MochaError } from './types';
import type { EventEmitter } from 'events';
declare type EventTypes = 'hook' | 'test' | 'suite';
declare class MochaAdapter {
    private _cid;
    private _config;
    private _specs;
    private _capabilities;
    private _reporter;
    private _mocha?;
    private _runner?;
    private _specLoadError?;
    private _level;
    private _hasTests;
    private _suiteIds;
    private _suiteCnt;
    private _hookCnt;
    private _testCnt;
    constructor(_cid: string, _config: MochaConfig, _specs: string[], _capabilities: WebDriver.Capabilities, _reporter: EventEmitter);
    init(): Promise<this>;
    _loadFiles(mochaOpts: MochaOpts): Promise<void>;
    hasTests(): boolean;
    run(): Promise<unknown>;
    options(options: MochaOpts, context: MochaContext): void;
    preRequire(context: Mocha.MochaGlobals, file: string, mocha: Mocha): void;
    wrapHook(hookName: keyof WebdriverIO.HookFunctions): () => Promise<void | unknown[]>;
    prepareMessage(hookName: keyof WebdriverIO.HookFunctions): FormattedMessage;
    formatMessage(params: FrameworkMessage): FormattedMessage;
    requireExternalModules(modules: string[], context: MochaContext): void;
    emit(event: string, payload: any, err?: MochaError): void;
    getSyncEventIdStart(type: EventTypes): string;
    getSyncEventIdEnd(type: EventTypes): string;
    getUID(message: FrameworkMessage): string;
}
declare const adapterFactory: {
    init?: Function;
};
export default adapterFactory;
export { MochaAdapter, adapterFactory };
//# sourceMappingURL=index.d.ts.map