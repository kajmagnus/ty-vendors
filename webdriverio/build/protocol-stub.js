"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@wdio/utils");
const WARN_ON_COMMANDS = ['addCommand', 'overwriteCommand'];
class ProtocolStub {
    static async newSession(options = {}) {
        const capabilities = emulateSessionCapabilities((options.capabilities || {}));
        const browser = addCommands({
            capabilities,
            ...utils_1.capabilitiesEnvironmentDetector(capabilities, options._automationProtocol || 'webdriver')
        });
        return browser;
    }
    static reloadSession() {
        throw new Error('Protocol Stub: Make sure to start webdriver or devtools session before reloading it.');
    }
    static attachToSession(options, modifier) {
        if (options || !modifier) {
            return ProtocolStub.newSession(options);
        }
        return addCommands(modifier({
            commandList: []
        }));
    }
}
exports.default = ProtocolStub;
function addCommands(browser) {
    WARN_ON_COMMANDS.forEach((commandName) => {
        browser[commandName] = commandNotAvailable(commandName);
    });
    return browser;
}
function emulateSessionCapabilities(caps) {
    const capabilities = {};
    Object.entries(caps).forEach(([key, value]) => {
        const newKey = key.replace('appium:', '');
        capabilities[newKey] = value;
    });
    if (caps.browserName && caps.browserName.toLowerCase() === 'chrome') {
        capabilities.chrome = true;
    }
    return capabilities;
}
function commandNotAvailable(commandName) {
    return () => { throw new Error(`Unable to use '${commandName}' before browser session is started.`); };
}
