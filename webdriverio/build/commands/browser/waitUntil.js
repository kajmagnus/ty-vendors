"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Timer_1 = __importDefault(require("../../utils/Timer"));
function waitUntil(condition, { timeout = this.options.waitforTimeout, interval = this.options.waitforInterval, timeoutMsg } = {}) {
    if (typeof condition !== 'function') {
        throw new Error('Condition is not a function');
    }
    if (typeof timeout !== 'number') {
        timeout = this.options.waitforTimeout;
    }
    if (typeof interval !== 'number') {
        interval = this.options.waitforInterval;
    }
    const fn = condition.bind(this);
    let timer = new Timer_1.default(interval, timeout, fn, true);
    return timer.catch((e) => {
        if (e.message === 'timeout') {
            if (typeof timeoutMsg === 'string') {
                throw new Error(timeoutMsg);
            }
            throw new Error(`waitUntil condition timed out after ${timeout}ms`);
        }
        throw new Error(`waitUntil condition failed with the following reason: ${(e && e.message) || e}`);
    });
}
exports.default = waitUntil;
