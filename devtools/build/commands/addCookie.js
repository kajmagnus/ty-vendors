"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function addCookie({ cookie }) {
    const page = this.getPageHandle();
    const cookieProps = Object.keys(cookie);
    if (!cookieProps.includes('name') || !cookieProps.includes('value')) {
        throw new Error('Provided cookie object is missing either "name" or "value" property');
    }
    if (typeof cookie.value !== 'string') {
        cookie.value = cookie.value.toString();
    }
    await page.setCookie(cookie);
    return null;
}
exports.default = addCookie;
