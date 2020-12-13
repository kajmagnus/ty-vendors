"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSync = exports.executeAsync = exports.executeSync = exports.hasWdioSyncSupport = exports.wrapCommand = exports.runFnInFiberContext = exports.executeHooksWithArgs = void 0;
const logger_1 = __importDefault(require("@wdio/logger"));
const log = logger_1.default('@wdio/utils:shim');
let inCommandHook = false;
let hasWdioSyncSupport = false;
exports.hasWdioSyncSupport = hasWdioSyncSupport;
let runSync;
exports.runSync = runSync;
let executeHooksWithArgs = async function executeHooksWithArgsShim(hooks = [], args = []) {
    if (!Array.isArray(hooks)) {
        hooks = [hooks];
    }
    if (!Array.isArray(args)) {
        args = [args];
    }
    const hooksPromises = hooks.map((hook) => new Promise((resolve) => {
        let result;
        try {
            result = hook.apply(null, args);
        }
        catch (e) {
            log.error(e.stack);
            return resolve(e);
        }
        if (result && typeof result.then === 'function') {
            return result.then(resolve, (e) => {
                log.error(e.stack);
                resolve(e);
            });
        }
        resolve(result);
    }));
    return Promise.all(hooksPromises);
};
exports.executeHooksWithArgs = executeHooksWithArgs;
let runFnInFiberContext = function (fn) {
    return function (...args) {
        return Promise.resolve(fn.apply(this, args));
    };
};
exports.runFnInFiberContext = runFnInFiberContext;
let wrapCommand = function wrapCommand(commandName, fn) {
    return async function wrapCommandFn(...args) {
        const beforeHookArgs = [commandName, args];
        if (!inCommandHook && this.options.beforeCommand) {
            inCommandHook = true;
            await executeHooksWithArgs.call(this, this.options.beforeCommand, beforeHookArgs);
            inCommandHook = false;
        }
        let commandResult;
        let commandError;
        try {
            commandResult = await fn.apply(this, args);
        }
        catch (err) {
            commandError = err;
        }
        if (!inCommandHook && this.options.afterCommand) {
            inCommandHook = true;
            const afterHookArgs = [...beforeHookArgs, commandResult, commandError];
            await executeHooksWithArgs.call(this, this.options.afterCommand, afterHookArgs);
            inCommandHook = false;
        }
        if (commandError) {
            throw commandError;
        }
        return commandResult;
    };
};
exports.wrapCommand = wrapCommand;
async function executeSyncFn(fn, retries, args = []) {
    this.wdioRetries = retries.attempts;
    try {
        let res = fn.apply(this, args);
        if (res instanceof Promise) {
            return await res;
        }
        return res;
    }
    catch (e) {
        if (retries.limit > retries.attempts) {
            retries.attempts++;
            return await executeSync.call(this, fn, retries, args);
        }
        return Promise.reject(e);
    }
}
async function executeAsync(fn, retries, args = []) {
    this.wdioRetries = retries.attempts;
    try {
        return await fn.apply(this, args);
    }
    catch (e) {
        if (retries.limit > retries.attempts) {
            retries.attempts++;
            return await executeAsync.call(this, fn, retries, args);
        }
        throw e;
    }
}
exports.executeAsync = executeAsync;
let executeSync = executeSyncFn;
exports.executeSync = executeSync;
try {
    if (!process.env.WDIO_NO_SYNC_SUPPORT) {
        const packageName = '@wdio/sync';
        const wdioSync = require(packageName);
        exports.hasWdioSyncSupport = hasWdioSyncSupport = true;
        exports.runFnInFiberContext = runFnInFiberContext = wdioSync.runFnInFiberContext;
        exports.wrapCommand = wrapCommand = wdioSync.wrapCommand;
        exports.executeHooksWithArgs = executeHooksWithArgs = wdioSync.executeHooksWithArgs;
        exports.executeSync = executeSync = wdioSync.executeSync;
        exports.runSync = runSync = wdioSync.runSync;
    }
}
catch (_a) {
}
