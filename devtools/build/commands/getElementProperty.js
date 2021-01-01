"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
async function getElementProperty({ elementId, name }) {
    const elementHandle = await this.elementStore.get(elementId);
    if (!elementHandle) {
        throw utils_1.getStaleElementError(elementId);
    }
    const jsHandle = await elementHandle.getProperty(name);
    if (!jsHandle) {
        return null;
    }
    return jsHandle.jsonValue();
}
exports.default = getElementProperty;
