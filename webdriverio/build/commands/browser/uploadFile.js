"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const archiver_1 = __importDefault(require("archiver"));
async function uploadFile(localPath) {
    if (typeof localPath !== 'string') {
        throw new Error('number or type of arguments don\'t agree with uploadFile command');
    }
    if (typeof this.file !== 'function') {
        throw new Error(`The uploadFile command is not available in ${this.capabilities.browserName}`);
    }
    let zipData = [];
    let source = fs_1.default.createReadStream(localPath);
    return new Promise((resolve, reject) => {
        archiver_1.default('zip')
            .on('error', (err) => reject(err))
            .on('data', (data) => zipData.push(data))
            .on('end', () => this.file(Buffer.concat(zipData).toString('base64')).then((localPath) => resolve(localPath), reject))
            .append(source, { name: path_1.default.basename(localPath) })
            .finalize();
    });
}
exports.default = uploadFile;
