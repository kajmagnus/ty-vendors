"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_REASON = exports.FF_REMOTE_DEBUG_ARG = exports.DRIVER_DEFAULT_ENDPOINT = exports.APPIUM_CAPABILITES = exports.APPIUM_IOS_CAPABILITIES = exports.APPIUM_ANDROID_CAPABILITIES = exports.JSONWP_CAPABILITIES = exports.W3C_CAPABILITIES = exports.W3C_SELECTOR_STRATEGIES = exports.UNICODE_CHARACTERS = exports.WDIO_DEFAULTS = exports.ELEMENT_KEY = void 0;
const HOOK_DEFINITION = {
    type: 'object',
    validate: (param) => {
        if (!Array.isArray(param)) {
            throw new Error('a hook option needs to be a list of functions');
        }
        for (const option of param) {
            if (typeof option === 'function') {
                continue;
            }
            throw new Error('expected hook to be type of function');
        }
        return true;
    }
};
exports.ELEMENT_KEY = 'element-6066-11e4-a52e-4f735466cecf';
exports.WDIO_DEFAULTS = {
    automationProtocol: {
        type: 'string',
        validate: (param) => {
            if (!['webdriver', 'devtools', './protocol-stub'].includes(param.toLowerCase())) {
                throw new Error(`Currently only "webdriver" and "devtools" is supproted as automationProtocol, you set "${param}"`);
            }
            try {
                require.resolve(param);
            }
            catch (e) {
                throw new Error('Automation protocol package is not installed!\n' +
                    `Please install it via \`npm install ${param}\``);
            }
        }
    },
    specs: {
        type: 'object',
        validate: (param) => {
            if (!Array.isArray(param)) {
                throw new Error('the "specs" option needs to be a list of strings');
            }
        }
    },
    exclude: {
        type: 'object',
        validate: (param) => {
            if (!Array.isArray(param)) {
                throw new Error('the "exclude" option needs to be a list of strings');
            }
        }
    },
    suites: {
        type: 'object'
    },
    capabilities: {
        type: 'object',
        validate: (param) => {
            if (!Array.isArray(param)) {
                if (typeof param === 'object') {
                    return true;
                }
                throw new Error('the "capabilities" options needs to be an object or a list of objects');
            }
            for (const option of param) {
                if (typeof option === 'object') {
                    continue;
                }
                throw new Error('expected every item of a list of capabilities to be of type object');
            }
            return true;
        },
        required: true
    },
    baseUrl: {
        type: 'string'
    },
    bail: {
        type: 'number',
        default: 0
    },
    waitforInterval: {
        type: 'number',
        default: 500
    },
    waitforTimeout: {
        type: 'number',
        default: 3000
    },
    framework: {
        type: 'string'
    },
    reporters: {
        type: 'object',
        validate: (param) => {
            if (!Array.isArray(param)) {
                throw new Error('the "reporters" options needs to be a list of strings');
            }
            const isValidReporter = (option) => ((typeof option === 'string') ||
                (typeof option === 'function'));
            for (const option of param) {
                if (isValidReporter(option)) {
                    continue;
                }
                if (Array.isArray(option) &&
                    typeof option[1] === 'object' &&
                    isValidReporter(option[0])) {
                    continue;
                }
                throw new Error('a reporter should be either a string in the format "wdio-<reportername>-reporter" ' +
                    'or a function/class. Please see the docs for more information on custom reporters ' +
                    '(https://webdriver.io/docs/customreporter.html)');
            }
            return true;
        }
    },
    services: {
        type: 'object',
        validate: (param) => {
            if (!Array.isArray(param)) {
                throw new Error('the "services" options needs to be a list of strings and/or arrays');
            }
            for (const option of param) {
                if (!Array.isArray(option)) {
                    if (typeof option === 'string') {
                        continue;
                    }
                    throw new Error('the "services" options needs to be a list of strings and/or arrays');
                }
            }
            return true;
        },
        default: []
    },
    execArgv: {
        type: 'object',
        validate: (param) => {
            if (!Array.isArray(param)) {
                throw new Error('the "execArgv" options needs to be a list of strings');
            }
        },
        default: []
    },
    maxInstances: {
        type: 'number'
    },
    maxInstancesPerCapability: {
        type: 'number'
    },
    outputDir: {
        type: 'string',
        default: process.cwd()
    },
    filesToWatch: {
        type: 'object',
        validate: (param) => {
            if (!Array.isArray(param)) {
                throw new Error('the "filesToWatch" options needs to be a list of strings');
            }
        }
    },
    onPrepare: HOOK_DEFINITION,
    onWorkerStart: HOOK_DEFINITION,
    before: HOOK_DEFINITION,
    beforeSession: HOOK_DEFINITION,
    beforeSuite: HOOK_DEFINITION,
    beforeHook: HOOK_DEFINITION,
    beforeTest: HOOK_DEFINITION,
    beforeCommand: HOOK_DEFINITION,
    afterCommand: HOOK_DEFINITION,
    afterTest: HOOK_DEFINITION,
    afterHook: HOOK_DEFINITION,
    afterSuite: HOOK_DEFINITION,
    afterSession: HOOK_DEFINITION,
    after: HOOK_DEFINITION,
    onComplete: HOOK_DEFINITION,
    onReload: HOOK_DEFINITION,
    beforeFeature: HOOK_DEFINITION,
    beforeScenario: HOOK_DEFINITION,
    beforeStep: HOOK_DEFINITION,
    afterStep: HOOK_DEFINITION,
    afterScenario: HOOK_DEFINITION,
    afterFeature: HOOK_DEFINITION,
};
exports.UNICODE_CHARACTERS = {
    'NULL': '\uE000',
    'Unidentified': '\uE000',
    'Cancel': '\uE001',
    'Help': '\uE002',
    'Back space': '\uE003',
    'Backspace': '\uE003',
    'Tab': '\uE004',
    'Clear': '\uE005',
    'Return': '\uE006',
    'Enter': '\uE007',
    'Shift': '\uE008',
    'Control': '\uE009',
    'Control Left': '\uE009',
    'Control Right': '\uE051',
    'Alt': '\uE00A',
    'Pause': '\uE00B',
    'Escape': '\uE00C',
    'Space': '\uE00D',
    ' ': '\uE00D',
    'Pageup': '\uE00E',
    'PageUp': '\uE00E',
    'Page_Up': '\uE00E',
    'Pagedown': '\uE00F',
    'PageDown': '\uE00F',
    'Page_Down': '\uE00F',
    'End': '\uE010',
    'Home': '\uE011',
    'Left arrow': '\uE012',
    'Arrow_Left': '\uE012',
    'ArrowLeft': '\uE012',
    'Up arrow': '\uE013',
    'Arrow_Up': '\uE013',
    'ArrowUp': '\uE013',
    'Right arrow': '\uE014',
    'Arrow_Right': '\uE014',
    'ArrowRight': '\uE014',
    'Down arrow': '\uE015',
    'Arrow_Down': '\uE015',
    'ArrowDown': '\uE015',
    'Insert': '\uE016',
    'Delete': '\uE017',
    'Semicolon': '\uE018',
    'Equals': '\uE019',
    'Numpad 0': '\uE01A',
    'Numpad 1': '\uE01B',
    'Numpad 2': '\uE01C',
    'Numpad 3': '\uE01D',
    'Numpad 4': '\uE01E',
    'Numpad 5': '\uE01F',
    'Numpad 6': '\uE020',
    'Numpad 7': '\uE021',
    'Numpad 8': '\uE022',
    'Numpad 9': '\uE023',
    'Multiply': '\uE024',
    'Add': '\uE025',
    'Separator': '\uE026',
    'Subtract': '\uE027',
    'Decimal': '\uE028',
    'Divide': '\uE029',
    'F1': '\uE031',
    'F2': '\uE032',
    'F3': '\uE033',
    'F4': '\uE034',
    'F5': '\uE035',
    'F6': '\uE036',
    'F7': '\uE037',
    'F8': '\uE038',
    'F9': '\uE039',
    'F10': '\uE03A',
    'F11': '\uE03B',
    'F12': '\uE03C',
    'Command': '\uE03D',
    'Meta': '\uE03D',
    'Zenkaku_Hankaku': '\uE040',
    'ZenkakuHankaku': '\uE040'
};
exports.W3C_SELECTOR_STRATEGIES = ['css selector', 'link text', 'partial link text', 'tag name', 'xpath'];
exports.W3C_CAPABILITIES = [
    'browserName', 'browserVersion', 'platformName', 'acceptInsecureCerts', 'pageLoadStrategy', 'proxy',
    'setWindowRect', 'timeouts', 'unhandledPromptBehavior'
];
exports.JSONWP_CAPABILITIES = [
    'browserName', 'version', 'platform', 'javascriptEnabled', 'takesScreenshot', 'handlesAlerts', 'databaseEnabled',
    'locationContextEnabled', 'applicationCacheEnabled', 'browserConnectionEnabled', 'cssSelectorsEnabled',
    'webStorageEnabled', 'rotatable', 'acceptSslCerts', 'nativeEvents', 'proxy'
];
exports.APPIUM_ANDROID_CAPABILITIES = [
    'appActivity', 'appPackage', 'appWaitActivity', 'appWaitPackage', 'appWaitDuration', 'deviceReadyTimeout',
    'androidCoverage', 'androidCoverageEndIntent', 'androidDeviceReadyTimeout', 'androidInstallTimeout',
    'androidInstallPath', 'adbPort', 'systemPort', 'remoteAdbHost', 'androidDeviceSocket', 'avd', 'avdLaunchTimeout',
    'avdReadyTimeout', 'avdArgs', 'useKeystore', 'keystorePath', 'keystorePassword', 'keyAlias', 'keyPassword',
    'chromedriverExecutable', 'chromedriverExecutableDir', 'chromedriverChromeMappingFile', 'autoWebviewTimeout',
    'intentAction', 'intentCategory', 'intentFlags', 'optionalIntentArguments', 'dontStopAppOnReset',
    'unicodeKeyboard', 'resetKeyboard', 'noSign', 'ignoreUnimportantViews', 'disableAndroidWatchers', 'chromeOptions',
    'recreateChromeDriverSessions', 'nativeWebScreenshot', 'androidScreenshotPath', 'autoGrantPermissions',
    'networkSpeed', 'gpsEnabled', 'isHeadless', 'uiautomator2ServerLaunchTimeout', 'uiautomator2ServerInstallTimeout',
    'otherApps'
];
exports.APPIUM_IOS_CAPABILITIES = [
    'calendarFormat', 'bundleId', 'udid', 'launchTimeout', 'locationServicesEnabled', 'locationServicesAuthorized',
    'autoAcceptAlerts', 'autoDismissAlerts', 'nativeInstrumentsLib', 'nativeWebTap', 'safariInitialUrl',
    'safariAllowPopups', 'safariIgnoreFraudWarning', 'safariOpenLinksInBackground', 'keepKeyChains',
    'localizableStringsDir', 'processArguments', 'interKeyDelay', 'showIOSLog', 'sendKeyStrategy',
    'screenshotWaitTimeout', 'waitForAppScript', 'webviewConnectRetries', 'appName', 'customSSLCert',
    'webkitResponseTimeout'
];
exports.APPIUM_CAPABILITES = [
    'automationName', 'platformName', 'platformVersion', 'deviceName', 'app', 'browserName', 'newCommandTimeout',
    'language', 'locale', 'udid', 'orientation', 'autoWebview', 'noReset', 'fullReset', 'eventTimings',
    'enablePerformanceLogging', 'printPageSourceOnFindFailure',
    ...exports.APPIUM_ANDROID_CAPABILITIES,
    ...exports.APPIUM_IOS_CAPABILITIES
];
exports.DRIVER_DEFAULT_ENDPOINT = {
    method: 'GET',
    host: 'localhost',
    port: 4444,
    path: '/status'
};
exports.FF_REMOTE_DEBUG_ARG = '-remote-debugging-port';
exports.ERROR_REASON = [
    'Failed', 'Aborted', 'TimedOut', 'AccessDenied', 'ConnectionClosed',
    'ConnectionReset', 'ConnectionRefused', 'ConnectionAborted',
    'ConnectionFailed', 'NameNotResolved', 'InternetDisconnected',
    'AddressUnreachable', 'BlockedByClient', 'BlockedByResponse'
];
