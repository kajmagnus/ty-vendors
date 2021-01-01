"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ElementStore {
    constructor() {
        this._index = 0;
        this._elementMap = new Map();
    }
    set(elementHandle) {
        const index = `ELEMENT-${++this._index}`;
        this._elementMap.set(index, elementHandle);
        return index;
    }
    async get(index) {
        const elementHandle = this._elementMap.get(index);
        if (!elementHandle) {
            return elementHandle;
        }
        const isElementAttachedToDOM = await elementHandle.evaluate((el) => {
            return el.isConnected;
        });
        return isElementAttachedToDOM ? elementHandle : undefined;
    }
    clear() {
        this._elementMap.clear();
    }
}
exports.default = ElementStore;
