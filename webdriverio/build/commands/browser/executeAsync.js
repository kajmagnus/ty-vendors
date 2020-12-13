"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
function executeAsync(script, ...args) {
    if ((typeof script !== 'string' && typeof script !== 'function')) {
        throw new Error('number or type of arguments don\'t agree with execute protocol command');
    }
    if (typeof script === 'function') {
        script = `return (${script}).apply(null, arguments)`;
    }
    return this.executeAsyncScript(script, utils_1.verifyArgsAndStripIfElement(args));
}
exports.default = executeAsync;
