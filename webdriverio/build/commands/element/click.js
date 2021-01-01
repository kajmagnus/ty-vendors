"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function click(options) {
    if (typeof options === 'undefined') {
        return this.elementClick(this.elementId);
    }
    if (typeof options !== 'object' || Array.isArray(options)) {
        throw new TypeError('Options must be an object');
    }
    let { button = 0, x: xoffset = 0, y: yoffset = 0 } = options || {};
    if (typeof xoffset !== 'number'
        || typeof yoffset !== 'number'
        || !Number.isInteger(xoffset)
        || !Number.isInteger(yoffset)) {
        throw new TypeError('Coördinates must be integers');
    }
    if (button === 'left') {
        button = 0;
    }
    if (button === 'middle') {
        button = 1;
    }
    if (button === 'right') {
        button = 2;
    }
    if (![0, 1, 2].includes(button)) {
        throw new Error('Button type not supported.');
    }
    if (this.isW3C) {
        await this.performActions([{
                type: 'pointer',
                id: 'pointer1',
                parameters: {
                    pointerType: 'mouse'
                },
                actions: [{
                        type: 'pointerMove',
                        origin: this,
                        x: xoffset,
                        y: yoffset
                    }, {
                        type: 'pointerDown',
                        button
                    }, {
                        type: 'pointerUp',
                        button
                    }]
            }]);
        return this.releaseActions();
    }
    const { width, height } = await this.getElementSize(this.elementId);
    await this.moveToElement(this.elementId, xoffset + (width / 2), yoffset + (height / 2));
    return this.positionClick(button);
}
exports.default = click;
