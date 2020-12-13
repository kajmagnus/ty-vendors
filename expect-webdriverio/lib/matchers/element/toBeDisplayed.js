"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeVisible = exports.toBeDisplayed = void 0;
const utils_1 = require("../../utils");
const expectAdapter_1 = require("../../util/expectAdapter");
function toBeDisplayedFn(received, options = {}) {
    this.expectation = this.expectation || 'displayed';
    return browser.call(async () => {
        const result = await utils_1.executeCommandBe.call(this, received, async (el) => {
            try {
                return el.isDisplayed();
            }
            catch (_a) {
                return false;
            }
        }, options);
        return result;
    });
}
function toBeDisplayed(...args) {
    return expectAdapter_1.runExpect.call(this, toBeDisplayedFn, args);
}
exports.toBeDisplayed = toBeDisplayed;
function toBeVisible(el, options) {
    return utils_1.aliasFn.call(this, toBeDisplayed, { expectation: 'visible' }, el, options);
}
exports.toBeVisible = toBeVisible;
