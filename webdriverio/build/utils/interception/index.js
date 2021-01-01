"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Timer_1 = __importDefault(require("../Timer"));
class Interception {
    constructor(url, filterOptions = {}, browser) {
        this.respondOverwrites = [];
        this.matches = [];
        this.url = url;
        this.filterOptions = filterOptions;
        this.browser = browser;
    }
    get calls() {
        throw new Error('Implement me');
    }
    waitForResponse({ timeout = this.browser.options.waitforTimeout, interval = this.browser.options.waitforInterval, timeoutMsg, } = {}) {
        if (typeof timeout !== 'number') {
            timeout = this.browser.options.waitforTimeout;
        }
        if (typeof interval !== 'number') {
            interval = this.browser.options.waitforInterval;
        }
        const fn = async () => this.calls && (await this.calls).length > 0;
        const timer = new Timer_1.default(interval, timeout, fn, true);
        return this.browser.call(() => timer.catch((e) => {
            if (e.message === 'timeout') {
                if (typeof timeoutMsg === 'string') {
                    throw new Error(timeoutMsg);
                }
                throw new Error(`waitForResponse timed out after ${timeout}ms`);
            }
            throw new Error(`waitForResponse failed with the following reason: ${(e && e.message) || e}`);
        }));
    }
}
exports.default = Interception;
