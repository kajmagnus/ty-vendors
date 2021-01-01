"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
async function takeElementScreenshot({ elementId }) {
    const elementHandle = await this.elementStore.get(elementId);
    if (!elementHandle) {
        throw utils_1.getStaleElementError(elementId);
    }
    return elementHandle.screenshot({
        encoding: 'base64',
        type: 'png'
    });
}
exports.default = takeElementScreenshot;
