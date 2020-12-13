"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const utils_1 = require("../../utils");
const isFocused_1 = __importDefault(require("../../scripts/isFocused"));
async function isFocused() {
    const browser = await utils_1.getBrowserObject(this);
    return browser.execute(isFocused_1.default, {
        [constants_1.ELEMENT_KEY]: this.elementId,
        ELEMENT: this.elementId
    });
}
exports.default = isFocused;
