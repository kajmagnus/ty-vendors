"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function setCookies(cookieObjs) {
    const cookieObjsList = !Array.isArray(cookieObjs) ? [cookieObjs] : cookieObjs;
    if (cookieObjsList.some(obj => (typeof obj !== 'object'))) {
        throw new Error('Invalid input (see https://webdriver.io/docs/api/browser/setCookies.html for documentation.');
    }
    await Promise.all(cookieObjsList
        .map(cookieObj => this.addCookie(cookieObj)));
    return;
}
exports.default = setCookies;
