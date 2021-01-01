"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const createWindow_1 = __importDefault(require("../scripts/createWindow"));
const WINDOW_FEATURES = 'menubar=1,toolbar=1,location=1,resizable=1,scrollbars=1';
const NEW_PAGE_URL = 'about:blank';
const DEFAULT_WINDOW_TYPE = 'tab';
async function createWindow({ type }) {
    type = type || DEFAULT_WINDOW_TYPE;
    let newPage;
    if (type === 'window') {
        const page = this.getPageHandle();
        await page.evaluate(createWindow_1.default, NEW_PAGE_URL, WINDOW_FEATURES);
        const newWindowTarget = await this.browser.waitForTarget((target) => target.url() === NEW_PAGE_URL);
        newPage = await newWindowTarget.page();
        if (!newPage) {
            throw new Error('Couldn\'t find page to switch to');
        }
    }
    else {
        newPage = await this.browser.newPage();
    }
    const handle = uuid_1.v4();
    await newPage.bringToFront();
    this.currentWindowHandle = handle;
    this.windows.set(handle, newPage);
    return {
        handle: this.currentWindowHandle,
        type
    };
}
exports.default = createWindow;
