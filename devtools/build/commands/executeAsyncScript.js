"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const executeAsyncScript_1 = __importDefault(require("../scripts/executeAsyncScript"));
const utils_1 = require("../utils");
const constants_1 = require("../constants");
async function executeAsyncScript({ script, args }) {
    const page = this.getPageHandle(true);
    const scriptTimeout = this.timeouts.get('script') || 0;
    script = script.trim();
    if (script.startsWith('return (')) {
        script = script.slice(7);
    }
    if (script.startsWith('return')) {
        script = `(function () { ${script} }).apply(null, arguments)`;
    }
    const result = await page.$eval('html', executeAsyncScript_1.default, script, scriptTimeout, constants_1.SERIALIZE_PROPERTY, constants_1.SERIALIZE_FLAG, ...(await utils_1.transformExecuteArgs.call(this, args)));
    return utils_1.transformExecuteResult.call(this, page, result);
}
exports.default = executeAsyncScript;
