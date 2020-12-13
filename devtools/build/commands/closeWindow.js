"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
async function closeWindow() {
    delete this.currentFrame;
    const page = this.getPageHandle();
    await page.close();
    this.windows.delete(this.currentWindowHandle || '');
    const handles = this.windows.keys();
    this.currentWindowHandle = handles.next().value;
    if (!this.currentWindowHandle) {
        const page = await this.browser.newPage();
        const newWindowHandle = uuid_1.v4();
        this.windows.set(newWindowHandle, page);
        this.currentWindowHandle = newWindowHandle;
    }
    const newPage = this.getPageHandle();
    await newPage.bringToFront();
    return this.currentWindowHandle;
}
exports.default = closeWindow;
