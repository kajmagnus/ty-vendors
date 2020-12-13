"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const newWindow_1 = __importDefault(require("../../scripts/newWindow"));
async function newWindow(url, { windowName = 'New Window', windowFeatures = '' } = {}) {
    if (typeof url !== 'string') {
        throw new Error('number or type of arguments don\'t agree with newWindow command');
    }
    if (this.isMobile) {
        throw new Error('newWindow command is not supported on mobile platforms');
    }
    await this.execute(newWindow_1.default, url, windowName, windowFeatures);
    const tabs = await this.getWindowHandles();
    const newTab = tabs.pop();
    if (!newTab) {
        throw new Error('No window handle was found to switch to');
    }
    await this.switchToWindow(newTab);
    return newTab;
}
exports.default = newWindow;
