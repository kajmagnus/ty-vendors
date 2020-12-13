"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function deleteAllCookies() {
    const page = this.getPageHandle();
    const cookies = await page.cookies();
    for (const cookie of cookies) {
        await page.deleteCookie(cookie);
    }
    return null;
}
exports.default = deleteAllCookies;
