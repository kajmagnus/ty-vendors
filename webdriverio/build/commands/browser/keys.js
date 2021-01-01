"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
function keys(value) {
    let keySequence = [];
    if (typeof value === 'string') {
        keySequence = utils_1.checkUnicode(value, this.isDevTools);
    }
    else if (Array.isArray(value)) {
        const charArray = value;
        for (const charSet of charArray) {
            keySequence = keySequence.concat(utils_1.checkUnicode(charSet, this.isDevTools));
        }
    }
    else {
        throw new Error('"keys" command requires a string or array of strings as parameter');
    }
    if (!this.isW3C) {
        return this.sendKeys(keySequence);
    }
    const keyDownActions = keySequence.map((value) => ({ type: 'keyDown', value }));
    const keyUpActions = keySequence.map((value) => ({ type: 'keyUp', value }));
    return this.performActions([{
            type: 'key',
            id: 'keyboard',
            actions: [...keyDownActions, ...keyUpActions]
        }]).then(() => this.releaseActions());
}
exports.default = keys;
