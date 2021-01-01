"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const utils_1 = require("@wdio/utils");
const utils_2 = require("../utils");
const finder_1 = require("./finder");
const newLineRegex = /\r?\n/;
function darwin() {
    const suffixes = [
        '/Contents/MacOS/firefox-bin'
    ];
    const appName = 'Firefox Nightly';
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
        { regex: new RegExp(`^${process.env.HOME}/Applications/.*Firefox.app`), weight: 50 },
        { regex: /^\/Applications\/.*Firefox.app/, weight: 100 },
        { regex: /^\/Volumes\/.*Firefox.app/, weight: -2 }
    ];
    const whichFinds = utils_2.findByWhich(['firefox-nightly', 'firefox-trunk'], [{ regex: /firefox-nightly/, weight: 51 }]);
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
        installations = installations.concat(findFirefoxExecutables(folder));
    });
    const whichFinds = utils_2.findByWhich(['firefox-nightly', 'firefox-trunk', 'firefox'], [{ regex: /firefox/, weight: 51 }]);
    return [...installations, ...whichFinds];
}
function win32() {
    const installations = [];
    const suffixes = [
        `${path_1.default.sep}Firefox Nightly${path_1.default.sep}Application${path_1.default.sep}firefox.exe`
    ];
    const prefixes = [
        process.env.LOCALAPPDATA || '', process.env.PROGRAMFILES || '', process.env['PROGRAMFILES(X86)'] || ''
    ].filter(Boolean);
    prefixes.forEach(prefix => suffixes.forEach(suffix => {
        const firefoxPath = path_1.default.join(prefix, suffix);
        if (utils_1.canAccess(firefoxPath)) {
            installations.push(firefoxPath);
        }
    }));
    return installations;
}
function findFirefoxExecutables(folder) {
    const argumentsRegex = /(^[^ ]+).*/;
    const edgeExecRegex = '^Exec=/.*/(firefox)-.*';
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
