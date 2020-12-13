"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const uuid_1 = require("uuid");
const launcher_1 = __importDefault(require("../launcher"));
const index_1 = require("../index");
async function newSession({ capabilities }) {
    const browser = await launcher_1.default(capabilities);
    const sessionId = uuid_1.v4();
    const [browserName, browserVersion] = (await browser.version()).split('/');
    index_1.sessionMap.set(sessionId, browser);
    return {
        sessionId,
        capabilities: {
            browserName,
            browserVersion,
            platformName: os_1.default.platform(),
            platformVersion: os_1.default.release()
        }
    };
}
exports.default = newSession;
