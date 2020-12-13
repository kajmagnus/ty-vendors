"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const utils_1 = require("../../utils");
const isElementClickable_1 = __importDefault(require("../../scripts/isElementClickable"));
async function isClickable() {
    if (!await this.isDisplayed()) {
        return false;
    }
    const browser = utils_1.getBrowserObject(this);
    return browser.execute(isElementClickable_1.default, {
        [constants_1.ELEMENT_KEY]: this.elementId,
        ELEMENT: this.elementId
    });
}
exports.default = isClickable;
