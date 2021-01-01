"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
async function moveTo({ xOffset, yOffset } = {}) {
    if (!this.isW3C) {
        return this.moveToElement(this.elementId, xOffset, yOffset);
    }
    const { x, y, width, height } = await utils_1.getElementRect(this);
    const { scrollX, scrollY } = await utils_1.getScrollPosition(this);
    const newXOffset = Math.floor(x - scrollX + (typeof xOffset === 'number' ? xOffset : (width / 2)));
    const newYOffset = Math.floor(y - scrollY + (typeof yOffset === 'number' ? yOffset : (height / 2)));
    return this.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'mouse' },
            actions: [{ type: 'pointerMove', duration: 0, x: newXOffset, y: newYOffset }]
        }]).then(() => this.releaseActions());
}
exports.default = moveTo;
