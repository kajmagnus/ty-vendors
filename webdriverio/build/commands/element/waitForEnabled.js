"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function waitForEnabled({ timeout = this.options.waitforTimeout, interval = this.options.waitforInterval, reverse = false, timeoutMsg = `element ("${this.selector}") still ${reverse ? '' : 'not '}enabled after ${timeout}ms` } = {}) {
    if (!this.elementId && !reverse) {
        await this.waitForExist({ timeout, interval, timeoutMsg });
    }
    return this.waitUntil(async () => reverse !== await this.isEnabled(), { timeout, interval, timeoutMsg });
}
exports.default = waitForEnabled;
