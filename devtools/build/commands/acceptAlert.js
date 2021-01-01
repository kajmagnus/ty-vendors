"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function acceptAlert() {
    if (!this.activeDialog) {
        throw new Error('no such alert');
    }
    await this.activeDialog.accept();
    delete this.activeDialog;
    return null;
}
exports.default = acceptAlert;
