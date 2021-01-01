"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const logger_1 = __importDefault(require("@wdio/logger"));
const elementstore_1 = __importDefault(require("./elementstore"));
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const log = logger_1.default('devtools');
class DevToolsDriver {
    constructor(browser, pages) {
        this.commands = {};
        this.elementStore = new elementstore_1.default();
        this.windows = new Map();
        this.timeouts = new Map();
        this.activeDialog = undefined;
        this.browser = browser;
        const dir = path_1.default.resolve(__dirname, 'commands');
        const files = fs_1.default.readdirSync(dir).filter((file) => (file.endsWith('.js') ||
            (file.endsWith('.ts') &&
                !file.endsWith('.d.ts'))));
        for (let filename of files) {
            const commandName = path_1.default.basename(filename, path_1.default.extname(filename));
            if (!commandName) {
                throw new Error('Couldn\'t determine command name');
            }
            this.commands[commandName] = DevToolsDriver.requireCommand(path_1.default.join(dir, commandName));
        }
        for (const page of pages) {
            const pageId = uuid_1.v4();
            this.windows.set(pageId, page);
            this.currentFrame = page;
            this.currentWindowHandle = pageId;
        }
        this.setTimeouts(constants_1.DEFAULT_IMPLICIT_TIMEOUT, constants_1.DEFAULT_PAGELOAD_TIMEOUT, constants_1.DEFAULT_SCRIPT_TIMEOUT);
        const page = this.getPageHandle();
        if (page) {
            page.on('dialog', this.dialogHandler.bind(this));
            page.on('framenavigated', this.framenavigatedHandler.bind(this));
        }
    }
    static requireCommand(filePath) {
        return require(filePath).default;
    }
    register(commandInfo) {
        const self = this;
        const { command, ref, parameters, variables = [] } = commandInfo;
        if (typeof this.commands[command] !== 'function') {
            return () => { throw new Error(`Command "${command}" is not yet implemented`); };
        }
        let retries = 0;
        const wrappedCommand = async function (...args) {
            await self.checkPendingNavigations();
            const params = utils_1.validate(command, parameters, variables, ref, args);
            let result;
            try {
                this.emit('command', { command, params, retries });
                result = await self.commands[command].call(self, params);
            }
            catch (err) {
                if (err.message.includes('most likely because of a navigation')) {
                    log.debug('Command failed due to unfinished page transition, retrying...');
                    const page = self.getPageHandle();
                    await new Promise((resolve, reject) => {
                        const pageloadTimeout = setTimeout(() => reject(new Error('page load timeout')), self.timeouts.get('pageLoad'));
                        page.once('load', () => {
                            clearTimeout(pageloadTimeout);
                            resolve();
                        });
                    });
                    ++retries;
                    return wrappedCommand.apply(this, args);
                }
                throw utils_1.sanitizeError(err);
            }
            this.emit('result', { command, params, retries, result: { value: result } });
            if (typeof result !== 'undefined') {
                const isScreenshot = (command.toLowerCase().includes('screenshot') &&
                    typeof result === 'string' &&
                    result.length > 64);
                log.info('RESULT', isScreenshot ? `${result.substr(0, 61)}...` : result);
            }
            return result;
        };
        return wrappedCommand;
    }
    dialogHandler(dialog) {
        this.activeDialog = dialog;
    }
    framenavigatedHandler(frame) {
        this.currentFrameUrl = frame.url();
        this.elementStore.clear();
    }
    setTimeouts(implicit, pageLoad, script) {
        if (typeof implicit === 'number') {
            this.timeouts.set('implicit', implicit);
        }
        if (typeof pageLoad === 'number') {
            this.timeouts.set('pageLoad', pageLoad);
        }
        if (typeof script === 'number') {
            this.timeouts.set('script', script);
        }
        const page = this.getPageHandle();
        const pageloadTimeout = this.timeouts.get('pageLoad');
        if (page && pageloadTimeout) {
            page.setDefaultTimeout(pageloadTimeout);
        }
    }
    getPageHandle(isInFrame = false) {
        if (isInFrame && this.currentFrame) {
            return this.currentFrame;
        }
        if (!this.currentWindowHandle) {
            throw new Error('no current window handle registered');
        }
        const pageHandle = this.windows.get(this.currentWindowHandle);
        if (!pageHandle) {
            throw new Error('Couldn\'t find page handle');
        }
        return pageHandle;
    }
    async checkPendingNavigations(pendingNavigationStart) {
        let page = this.getPageHandle();
        if (this.activeDialog || !page) {
            return;
        }
        pendingNavigationStart = pendingNavigationStart || Date.now();
        const pageloadTimeout = this.timeouts.get('pageLoad') || 0;
        if (!page.mainFrame) {
            const pages = await this.browser.pages();
            const mainFrame = pages.find((browserPage) => (browserPage.frames().find((frame) => page === frame)));
            if (mainFrame) {
                page = mainFrame;
            }
        }
        const pageloadTimeoutReached = (Date.now() - pendingNavigationStart) > pageloadTimeout;
        const executionContext = await page.mainFrame().executionContext();
        try {
            await executionContext.evaluate('1');
            const readyState = await executionContext.evaluate('document.readyState');
            if (readyState !== 'complete' && !pageloadTimeoutReached) {
                return this.checkPendingNavigations(pendingNavigationStart);
            }
        }
        catch (err) {
            if (pageloadTimeoutReached) {
                throw err;
            }
            return this.checkPendingNavigations(pendingNavigationStart);
        }
    }
}
exports.default = DevToolsDriver;
