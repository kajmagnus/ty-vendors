"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
function initialisePlugin(name, type) {
    if (name[0] === '@' || path_1.default.isAbsolute(name)) {
        const service = utils_1.safeRequire(name);
        if (service) {
            return service;
        }
    }
    if (typeof type !== 'string') {
        throw new Error('No plugin type provided');
    }
    const scopedPlugin = utils_1.safeRequire(`@wdio/${name.toLowerCase()}-${type}`);
    if (scopedPlugin) {
        return scopedPlugin;
    }
    const plugin = utils_1.safeRequire(`wdio-${name.toLowerCase()}-${type}`);
    if (plugin) {
        return plugin;
    }
    throw new Error(`Couldn't find plugin "${name}" ${type}, neither as wdio scoped package ` +
        `"@wdio/${name.toLowerCase()}-${type}" nor as community package ` +
        `"wdio-${name.toLowerCase()}-${type}". Please make sure you have it installed!`);
}
exports.default = initialisePlugin;
