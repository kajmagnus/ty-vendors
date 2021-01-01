"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const getProperty_1 = __importDefault(require("../../scripts/getProperty"));
function getProperty(property) {
    if (this.isW3C) {
        return this.getElementProperty(this.elementId, property);
    }
    const browser = utils_1.getBrowserObject(this);
    return browser.execute(getProperty_1.default, { ELEMENT: this.elementId }, property);
}
exports.default = getProperty;
