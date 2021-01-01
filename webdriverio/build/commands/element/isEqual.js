"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const utils_1 = require("../../utils");
const getWebElement = (el) => ({
    [constants_1.ELEMENT_KEY]: el.elementId,
    ELEMENT: el.elementId
});
async function isEqual(el) {
    const browser = utils_1.getBrowserObject(this);
    if (browser.isMobile) {
        const context = await browser.getContext();
        if (context === null || context === void 0 ? void 0 : context.toLowerCase().includes('native')) {
            return this.elementId === el.elementId;
        }
    }
    let result;
    try {
        result = await browser.execute((el1, el2) => el1 === el2, getWebElement(this), getWebElement(el));
    }
    catch (err) {
        result = false;
    }
    return result;
}
exports.default = isEqual;
