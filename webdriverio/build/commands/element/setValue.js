"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function setValue(value, { translateToUnicode = true } = {}) {
    await this.clearValue();
    return this.addValue(value, { translateToUnicode });
}
exports.default = setValue;
