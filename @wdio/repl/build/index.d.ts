/// <reference types="node" />
import vm from 'vm';
import repl from 'repl';
export interface ReplConfig {
    commandTimeout: number;
    eval: repl.REPLEval;
    prompt: string;
    useGlobal: boolean;
    useColor: boolean;
}
export declare type ReplCallback = (err: Error | null, result: any) => void;
export default class WDIORepl {
    static introMessage: string;
    private _config;
    private _isCommandRunning;
    private _replServer;
    constructor(config?: ReplConfig);
    eval(cmd: string, context: vm.Context, filename: string | undefined, callback: ReplCallback): void | Promise<any>;
    private _runCmd;
    private _handleResult;
    start(context?: vm.Context): Promise<unknown>;
}
//# sourceMappingURL=index.d.ts.map