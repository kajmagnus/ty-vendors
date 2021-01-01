"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function waitForClickable({ timeout = this.options.waitforTimeout, interval = this.options.waitforInterval, reverse = false, timeoutMsg = `element ("${this.selector}") still ${reverse ? '' : 'not '}clickable after ${timeout}ms` } = {}) {
    return this.waitUntil(async () => reverse !== await this.isClickable(), { timeout, timeoutMsg, interval });
}
exports.default = waitForClickable;
