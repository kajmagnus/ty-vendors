import type { executeHooksWithArgs, executeAsync, runSync } from '../shim';
export declare type HookFnArgs<T> = (ctx: T) => [unknown, T];
export interface WrapperMethods {
    executeHooksWithArgs: typeof executeHooksWithArgs;
    executeAsync: typeof executeAsync;
    runSync: typeof runSync;
}
export interface SpecFunction {
    specFn: Function;
    specFnArgs: any[];
}
export interface BeforeHookParam<T> {
    beforeFn: Function | Function[];
    beforeFnArgs: HookFnArgs<T>;
}
export interface AfterHookParam<T> {
    afterFn: Function | Function[];
    afterFnArgs: HookFnArgs<T>;
}
export interface JasmineContext {
    failedExpectations: Array<Record<string, unknown>>;
}
export declare type SpecArguments = ([
    Function
] | [
    Function,
    number
] | [
    string,
    Function
] | [
    string,
    Function,
    number
]);
//# sourceMappingURL=types.d.ts.map