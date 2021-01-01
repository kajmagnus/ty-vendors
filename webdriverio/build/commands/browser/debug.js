"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serialize_error_1 = require("serialize-error");
const repl_1 = __importDefault(require("@wdio/repl"));
function debug(commandTimeout = 5000) {
    const repl = new repl_1.default();
    const { introMessage } = repl_1.default;
    if (!process.env.WDIO_WORKER || typeof process.send !== 'function') {
        console.log(repl_1.default.introMessage);
        const context = {
            browser: this,
            driver: this,
            $: this.$.bind(this),
            $$: this.$$.bind(this)
        };
        return repl.start(context);
    }
    process._debugProcess(process.pid);
    process.send({
        origin: 'debugger',
        name: 'start',
        params: { commandTimeout, introMessage }
    });
    let commandResolve = () => { };
    process.on('message', (m) => {
        if (m.origin !== 'debugger') {
            return;
        }
        if (m.name === 'stop') {
            process._debugEnd(process.pid);
            return commandResolve();
        }
        if (m.name === 'eval') {
            repl.eval(m.content.cmd, global, undefined, (err, result) => {
                if (typeof process.send !== 'function') {
                    return;
                }
                if (err) {
                    process.send({
                        origin: 'debugger',
                        name: 'result',
                        params: {
                            error: true,
                            ...serialize_error_1.serializeError(err)
                        }
                    });
                }
                if (typeof result === 'function') {
                    result = `[Function: ${result.name}]`;
                }
                process.send({
                    origin: 'debugger',
                    name: 'result',
                    params: { result }
                });
            });
        }
    });
    return new Promise((resolve) => (commandResolve = resolve));
}
exports.default = debug;
