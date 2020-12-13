"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
const constants_1 = require("../../constants");
class WebDriverInterception extends _1.default {
    async init() {
        const { mockId } = await this.browser.mockRequest(this.url, this.filterOptions);
        this.mockId = mockId;
    }
    get calls() {
        return this.browser.call(async () => this.browser.getMockCalls(this.mockId));
    }
    clear() {
        return this.browser.call(async () => this.browser.clearMockCalls(this.mockId));
    }
    restore() {
        return this.browser.call(async () => this.browser.clearMockCalls(this.mockId, true));
    }
    respond(overwrite, params = {}) {
        return this.browser.call(async () => this.browser.respondMock(this.mockId, { overwrite, params, sticky: true }));
    }
    respondOnce(overwrite, params = {}) {
        return this.browser.call(async () => this.browser.respondMock(this.mockId, { overwrite, params }));
    }
    abort(errorReason, sticky = true) {
        if (typeof errorReason !== 'string' || !constants_1.ERROR_REASON.includes(errorReason)) {
            throw new Error(`Invalid value for errorReason, allowed are: ${constants_1.ERROR_REASON.join(', ')}`);
        }
        return this.browser.call(async () => this.browser.respondMock(this.mockId, { errorReason, sticky }));
    }
    abortOnce(errorReason) {
        return this.abort(errorReason, false);
    }
}
exports.default = WebDriverInterception;
