"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const utils_1 = require("../utils");
async function switchToFrame({ id }) {
    const page = this.getPageHandle(true);
    if (id === null && typeof page.parentFrame === 'function') {
        let parentFrame = await page.parentFrame();
        while (parentFrame) {
            parentFrame = await parentFrame.parentFrame();
        }
        this.currentFrame = parentFrame;
        return null;
    }
    const idAsElementReference = id;
    if (typeof idAsElementReference[constants_1.ELEMENT_KEY] === 'string') {
        const elementHandle = await this.elementStore.get(idAsElementReference[constants_1.ELEMENT_KEY]);
        if (!elementHandle) {
            throw utils_1.getStaleElementError(id);
        }
        const contentFrame = await elementHandle.contentFrame();
        if (!contentFrame) {
            throw new Error('no such frame');
        }
        this.currentFrame = contentFrame;
        return null;
    }
    if (typeof id === 'number') {
        let getFrames = page.frames || page.childFrames;
        const childFrames = await getFrames.apply(page);
        const childFrame = childFrames[id];
        if (!childFrame) {
            throw new Error('no such frame');
        }
        this.currentFrame = childFrame;
        return null;
    }
    throw new Error(`Could not switch frame, unknwon id: ${id}`);
}
exports.default = switchToFrame;
