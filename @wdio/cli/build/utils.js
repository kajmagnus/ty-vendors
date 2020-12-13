"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPathForFileGeneration = exports.getAnswers = exports.generateTestFiles = exports.hasFile = exports.getCapabilities = exports.validateServiceAnswers = exports.renderConfigurationFile = exports.convertPackageHashToObject = exports.addServiceDeps = exports.replaceConfig = exports.findInConfig = exports.getRunnerName = exports.runOnCompleteHook = exports.runLauncherHook = exports.runServiceHook = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const logger_1 = __importDefault(require("@wdio/logger"));
const recursive_readdir_1 = __importDefault(require("recursive-readdir"));
const webdriverio_1 = require("webdriverio");
const child_process_1 = require("child_process");
const util_1 = require("util");
const constants_1 = require("./constants");
const log = logger_1.default('@wdio/cli:utils');
const TEMPLATE_ROOT_DIR = path_1.default.join(__dirname, 'templates', 'exampleFiles');
const renderFile = util_1.promisify(ejs_1.default.renderFile);
async function runServiceHook(launcher, hookName, ...args) {
    return Promise.all(launcher.map(async (service) => {
        try {
            if (typeof service[hookName] === 'function') {
                await service[hookName](...args);
            }
        }
        catch (e) {
            const message = `A service failed in the '${hookName}' hook\n${e.stack}\n\n`;
            if (e instanceof webdriverio_1.SevereServiceError) {
                return { status: 'rejected', reason: message };
            }
            log.error(`${message}Continue...`);
        }
    })).then(results => {
        const rejectedHooks = results.filter(p => p && p.status === 'rejected');
        if (rejectedHooks.length) {
            return Promise.reject(`\n${rejectedHooks.map(p => p && p.reason).join()}\n\nStopping runner...`);
        }
    });
}
exports.runServiceHook = runServiceHook;
async function runLauncherHook(hook, ...args) {
    const catchFn = (e) => log.error(`Error in hook: ${e.stack}`);
    if (typeof hook === 'function') {
        hook = [hook];
    }
    return Promise.all(hook.map((hook) => {
        try {
            return hook(...args);
        }
        catch (e) {
            return catchFn(e);
        }
    })).catch(catchFn);
}
exports.runLauncherHook = runLauncherHook;
async function runOnCompleteHook(onCompleteHook, config, capabilities, exitCode, results) {
    if (typeof onCompleteHook === 'function') {
        onCompleteHook = [onCompleteHook];
    }
    return Promise.all(onCompleteHook.map(async (hook) => {
        try {
            await hook(exitCode, config, capabilities, results);
            return 0;
        }
        catch (e) {
            log.error(`Error in onCompleteHook: ${e.stack}`);
            return 1;
        }
    }));
}
exports.runOnCompleteHook = runOnCompleteHook;
function getRunnerName(caps = {}) {
    let runner = caps.browserName ||
        caps.appPackage ||
        caps.appWaitActivity ||
        caps.app ||
        caps.platformName;
    if (!runner) {
        runner = Object.values(caps).length === 0 || Object.values(caps).some(cap => !cap.capabilities) ? 'undefined' : 'MultiRemote';
    }
    return runner;
}
exports.getRunnerName = getRunnerName;
function buildNewConfigArray(str, type, change) {
    var _a;
    const newStr = str
        .split(`${type}s: `)[1]
        .replace('\'', '');
    let newArray = ((_a = newStr.match(/(\w*)/gmi)) === null || _a === void 0 ? void 0 : _a.filter(e => !!e).concat([change])) || [];
    return str
        .replace('// ', '')
        .replace(new RegExp(`(${type}s: )((.*\\s*)*)`), `$1[${newArray.map(e => `'${e}'`)}]`);
}
function buildNewConfigString(str, type, change) {
    return str.replace(new RegExp(`(${type}: )('\\w*')`), `$1'${change}'`);
}
function findInConfig(config, type) {
    let regexStr = `[\\/\\/]*[\\s]*${type}s: [\\s]*\\[([\\s]*['|"]\\w*['|"],*)*[\\s]*\\]`;
    if (type === 'framework') {
        regexStr = `[\\/\\/]*[\\s]*${type}: ([\\s]*['|"]\\w*['|"])`;
    }
    const regex = new RegExp(regexStr, 'gmi');
    return config.match(regex);
}
exports.findInConfig = findInConfig;
function replaceConfig(config, type, name) {
    if (type === 'framework') {
        return buildNewConfigString(config, type, name);
    }
    const match = findInConfig(config, type);
    if (!match || match.length === 0) {
        return;
    }
    const text = match.pop() || '';
    return config.replace(text, buildNewConfigArray(text, type, name));
}
exports.replaceConfig = replaceConfig;
function addServiceDeps(names, packages, update = false) {
    if (names.some(({ short }) => short === 'chromedriver')) {
        packages.push('chromedriver');
        if (update) {
            console.log('\n=======', '\nPlease change path to / in your wdio.conf.js:', "\npath: '/'", '\n=======\n');
        }
    }
    if (names.some(({ short }) => short === 'appium')) {
        const result = child_process_1.execSync('appium --version || echo APPIUM_MISSING').toString().trim();
        if (result === 'APPIUM_MISSING') {
            packages.push('appium');
        }
        else if (update) {
            console.log('\n=======', '\nUsing globally installed appium', result, '\nPlease add the following to your wdio.conf.js:', "\nappium: { command: 'appium' }", '\n=======\n');
        }
    }
}
exports.addServiceDeps = addServiceDeps;
function convertPackageHashToObject(pkg, hash = '$--$') {
    const splitHash = pkg.split(hash);
    return {
        package: splitHash[0],
        short: splitHash[1]
    };
}
exports.convertPackageHashToObject = convertPackageHashToObject;
async function renderConfigurationFile(answers) {
    const tplPath = path_1.default.join(__dirname, 'templates/wdio.conf.tpl.ejs');
    const renderedTpl = await renderFile(tplPath, { answers });
    fs_extra_1.default.writeFileSync(path_1.default.join(process.cwd(), 'wdio.conf.js'), renderedTpl);
}
exports.renderConfigurationFile = renderConfigurationFile;
exports.validateServiceAnswers = (answers) => {
    let result = true;
    Object.entries(constants_1.EXCLUSIVE_SERVICES).forEach(([name, { services, message }]) => {
        const exists = answers.some(answer => answer.includes(name));
        const hasExclusive = services.some(service => answers.some(answer => answer.includes(service)));
        if (exists && hasExclusive) {
            result = `${name} cannot work together with ${services.join(', ')}\n${message}\nPlease uncheck one of them.`;
        }
    });
    return result;
};
function getCapabilities(arg) {
    const optionalCapabilites = {
        platformVersion: arg.platformVersion,
        udid: arg.udid,
        ...(arg.deviceName && { deviceName: arg.deviceName })
    };
    if (/.*\.(apk|app|ipa)$/.test(arg.option)) {
        return {
            capabilities: {
                app: arg.option,
                ...(arg.option.endsWith('apk') ? constants_1.ANDROID_CONFIG : constants_1.IOS_CONFIG),
                ...optionalCapabilites,
            }
        };
    }
    else if (/android/.test(arg.option)) {
        return { capabilities: { browserName: 'Chrome', ...constants_1.ANDROID_CONFIG, ...optionalCapabilites } };
    }
    else if (/ios/.test(arg.option)) {
        return { capabilities: { browserName: 'Safari', ...constants_1.IOS_CONFIG, ...optionalCapabilites } };
    }
    return { capabilities: { browserName: arg.option } };
}
exports.getCapabilities = getCapabilities;
function hasFile(filename) {
    return fs_extra_1.default.existsSync(path_1.default.join(process.cwd(), filename));
}
exports.hasFile = hasFile;
async function generateTestFiles(answers) {
    const testFiles = answers.framework === 'cucumber'
        ? [path_1.default.join(TEMPLATE_ROOT_DIR, 'cucumber')]
        : [path_1.default.join(TEMPLATE_ROOT_DIR, 'mochaJasmine')];
    if (answers.usePageObjects) {
        testFiles.push(path_1.default.join(TEMPLATE_ROOT_DIR, 'pageobjects'));
    }
    const files = (await Promise.all(testFiles.map((dirPath) => recursive_readdir_1.default(dirPath, [(file, stats) => !stats.isDirectory() && !(file.endsWith('.ejs') || file.endsWith('.feature'))])))).reduce((cur, acc) => [...acc, ...(cur)], []);
    for (const file of files) {
        const renderedTpl = await renderFile(file, answers);
        let destPath = (file.endsWith('page.js.ejs')
            ? `${answers.destPageObjectRootPath}/${path_1.default.basename(file)}`
            : file.includes('step_definition')
                ? `${answers.stepDefinitions}`
                : `${answers.destSpecRootPath}/${path_1.default.basename(file)}`).replace(/\.ejs$/, '').replace(/\.js$/, answers.isUsingTypeScript ? '.ts' : '.js');
        fs_extra_1.default.ensureDirSync(path_1.default.dirname(destPath));
        fs_extra_1.default.writeFileSync(destPath, renderedTpl);
    }
}
exports.generateTestFiles = generateTestFiles;
async function getAnswers(yes) {
    return yes
        ? constants_1.QUESTIONNAIRE.reduce((answers, question) => Object.assign(answers, question.when && !question.when(answers)
            ? {}
            : { [question.name]: typeof question.default !== 'undefined'
                    ? typeof question.default === 'function'
                        ? question.default(answers)
                        : question.default
                    : question.choices && question.choices.length
                        ? question.choices[0].value
                            ? question.choices[0].value
                            : question.choices[0]
                        : {}
            }), {})
        : await inquirer_1.default.prompt(constants_1.QUESTIONNAIRE);
}
exports.getAnswers = getAnswers;
function getPathForFileGeneration(answers) {
    const destSpecRootPath = path_1.default.join(process.cwd(), path_1.default.dirname(answers.specs || '').replace(/\*\*$/, ''));
    const destStepRootPath = path_1.default.join(process.cwd(), path_1.default.dirname(answers.stepDefinitions || ''));
    const destPageObjectRootPath = answers.usePageObjects
        ? path_1.default.join(process.cwd(), path_1.default.dirname(answers.pages || '').replace(/\*\*$/, ''))
        : '';
    let relativePath = (answers.generateTestFiles && answers.usePageObjects)
        ? !(convertPackageHashToObject(answers.framework).short === 'cucumber')
            ? path_1.default.relative(destSpecRootPath, destPageObjectRootPath)
            : path_1.default.relative(destStepRootPath, destPageObjectRootPath)
        : '';
    if (process.platform === 'win32') {
        relativePath = relativePath.replace(/\\/g, '/');
    }
    return {
        destSpecRootPath: destSpecRootPath,
        destStepRootPath: destStepRootPath,
        destPageObjectRootPath: destPageObjectRootPath,
        relativePath: relativePath
    };
}
exports.getPathForFileGeneration = getPathForFileGeneration;
