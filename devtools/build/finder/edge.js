"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const edge_paths_1 = require("edge-paths");
const child_process_1 = require("child_process");
const utils_1 = require("@wdio/utils");
const utils_2 = require("../utils");
const finder_1 = require("./finder");
const newLineRegex = /\r?\n/;
const EDGE_BINARY_NAMES = ['edge', 'msedge', 'microsoftedge'];
const EDGE_REGEX = /((ms|microsoft))?edge/g;
function darwin() {
    const suffixes = [
        '/Contents/MacOS/Microsoft Edge'
    ];
    const appName = 'Microsoft Edge';
    const defaultPath = `/Applications/${appName}.app${suffixes[0]}`;
    let installations;
    if (utils_1.canAccess(defaultPath)) {
        installations = [defaultPath];
    }
    else {
        const appPaths = finder_1.darwinGetAppPaths(appName);
        installations = finder_1.darwinGetInstallations(appPaths, suffixes);
    }
    const priorities = [
        { regex: new RegExp(`^${process.env.HOME}/Applications/.*Microsoft Edge.app`), weight: 50 },
        { regex: /^\/Applications\/.*Microsoft Edge.app/, weight: 100 },
        { regex: /^\/Volumes\/.*Microsoft Edge.app/, weight: -2 }
    ];
    const whichFinds = utils_2.findByWhich(EDGE_BINARY_NAMES, [{ regex: EDGE_REGEX, weight: 51 }]);
    const installFinds = utils_2.sort(installations, priorities);
    return [...installFinds, ...whichFinds];
}
function linux() {
    let installations = [];
    const desktopInstallationFolders = [
        path_1.default.join(require('os').homedir(), '.local/share/applications/'),
        '/usr/share/applications/',
    ];
    desktopInstallationFolders.forEach(folder => {
        installations = installations.concat(findEdgeExecutables(folder));
    });
    return utils_2.findByWhich(EDGE_BINARY_NAMES, [{ regex: EDGE_REGEX, weight: 51 }]);
}
function win32() {
    const installations = [];
    const suffixes = [
        `${path_1.default.sep}Microsoft${path_1.default.sep}Edge${path_1.default.sep}Application${path_1.default.sep}edge.exe`,
        `${path_1.default.sep}Microsoft${path_1.default.sep}Edge${path_1.default.sep}Application${path_1.default.sep}msedge.exe`,
        `${path_1.default.sep}Microsoft${path_1.default.sep}Edge Dev${path_1.default.sep}Application${path_1.default.sep}msedge.exe`
    ];
    const prefixes = [
        process.env.LOCALAPPDATA || '', process.env.PROGRAMFILES || '', process.env['PROGRAMFILES(X86)'] || ''
    ].filter(Boolean);
    prefixes.forEach(prefix => suffixes.forEach(suffix => {
        const edgePath = path_1.default.join(prefix, suffix);
        if (utils_1.canAccess(edgePath)) {
            installations.push(edgePath);
        }
    }));
    if (installations.length === 0) {
        const edgePath = edge_paths_1.getEdgePath();
        if (utils_1.canAccess(edgePath)) {
            installations.push(edgePath);
        }
    }
    return installations;
}
function findEdgeExecutables(folder) {
    const argumentsRegex = /(^[^ ]+).*/;
    const edgeExecRegex = '^Exec=/.*/(edge)-.*';
    let installations = [];
    if (utils_1.canAccess(folder)) {
        let execPaths;
        try {
            execPaths = child_process_1.execSync(`grep -ER "${edgeExecRegex}" ${folder} | awk -F '=' '{print $2}'`, { stdio: 'pipe' });
        }
        catch (e) {
            execPaths = child_process_1.execSync(`grep -Er "${edgeExecRegex}" ${folder} | awk -F '=' '{print $2}'`, { stdio: 'pipe' });
        }
        execPaths = execPaths.toString().split(newLineRegex).map((execPath) => execPath.replace(argumentsRegex, '$1'));
        execPaths.forEach((execPath) => utils_1.canAccess(execPath) && installations.push(execPath));
    }
    return installations;
}
exports.default = {
    darwin,
    linux,
    win32
};
