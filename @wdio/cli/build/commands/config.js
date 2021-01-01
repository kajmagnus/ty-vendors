"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.missingConfigurationPrompt = exports.handler = exports.builder = exports.cmdArgs = exports.desc = exports.command = void 0;
const util_1 = __importDefault(require("util"));
const inquirer_1 = __importDefault(require("inquirer"));
const yarn_install_1 = __importDefault(require("yarn-install"));
const constants_1 = require("../constants");
const utils_1 = require("../utils");
exports.command = 'config';
exports.desc = 'Initialize WebdriverIO and setup configuration in your current project.';
exports.cmdArgs = {
    yarn: {
        type: 'boolean',
        desc: 'Install packages via yarn package manager.',
        default: utils_1.hasFile('yarn.lock')
    },
    yes: {
        alias: 'y',
        desc: 'will fill in all config defaults without prompting',
        type: 'boolean',
        default: false
    }
};
exports.builder = (yargs) => {
    return yargs
        .options(exports.cmdArgs)
        .epilogue(constants_1.CLI_EPILOGUE)
        .help();
};
const runConfig = async function (useYarn, yes, exit = false) {
    console.log(constants_1.CONFIG_HELPER_INTRO);
    const answers = await utils_1.getAnswers(yes);
    const frameworkPackage = utils_1.convertPackageHashToObject(answers.framework);
    const runnerPackage = utils_1.convertPackageHashToObject(answers.runner || constants_1.SUPPORTED_PACKAGES.runner[0].value);
    const servicePackages = answers.services.map((service) => utils_1.convertPackageHashToObject(service));
    const reporterPackages = answers.reporters.map((reporter) => utils_1.convertPackageHashToObject(reporter));
    const packagesToInstall = [
        runnerPackage.package,
        frameworkPackage.package,
        ...reporterPackages.map(reporter => reporter.package),
        ...servicePackages.map(service => service.package)
    ];
    const syncExecution = answers.executionMode === 'sync';
    if (syncExecution) {
        packagesToInstall.push('@wdio/sync');
    }
    utils_1.addServiceDeps(servicePackages, packagesToInstall);
    console.log('\nInstalling wdio packages:\n-', packagesToInstall.join('\n- '));
    const result = yarn_install_1.default({ deps: packagesToInstall, dev: true, respectNpm5: !useYarn });
    if (result.status !== 0) {
        throw new Error(result.stderr);
    }
    console.log('\nPackages installed successfully, creating configuration file...');
    const parsedPaths = utils_1.getPathForFileGeneration(answers);
    const parsedAnswers = {
        ...answers,
        runner: runnerPackage.short,
        framework: frameworkPackage.short,
        reporters: reporterPackages.map(({ short }) => short),
        services: servicePackages.map(({ short }) => short),
        packagesToInstall,
        isUsingTypeScript: answers.isUsingCompiler === constants_1.COMPILER_OPTIONS.ts,
        isUsingBabel: answers.isUsingCompiler === constants_1.COMPILER_OPTIONS.babel,
        isSync: syncExecution,
        _async: syncExecution ? '' : 'async ',
        _await: syncExecution ? '' : 'await ',
        destSpecRootPath: parsedPaths.destSpecRootPath,
        destPageObjectRootPath: parsedPaths.destPageObjectRootPath,
        relativePath: parsedPaths.relativePath
    };
    try {
        await utils_1.renderConfigurationFile(parsedAnswers);
        if (answers.generateTestFiles) {
            console.log('\nConfig file installed successfully, creating test files...');
            await utils_1.generateTestFiles(parsedAnswers);
        }
    }
    catch (e) {
        console.error(`Couldn't write config file: ${e.stack}`);
        return !process.env.JEST_WORKER_ID && process.exit(1);
    }
    if (answers.isUsingCompiler === constants_1.COMPILER_OPTIONS.ts) {
        const wdioTypes = syncExecution ? '@wdio/sync' : 'webdriverio';
        const tsPkgs = `"${[
            wdioTypes,
            frameworkPackage.package,
            ...servicePackages
                .map(service => service.package)
                .filter(service => service.startsWith('@wdio'))
        ].join('", "')}"`;
        console.log(util_1.default.format(constants_1.TS_COMPILER_INSTRUCTIONS, tsPkgs));
    }
    console.log(constants_1.CONFIG_HELPER_SUCCESS_MESSAGE);
    if (exit && !process.env.JEST_WORKER_ID) {
        process.exit(0);
    }
};
async function handler(argv) {
    try {
        await runConfig(argv.yarn, argv.yes);
    }
    catch (error) {
        throw new Error(`something went wrong during setup: ${error.stack.slice(7)}`);
    }
}
exports.handler = handler;
async function missingConfigurationPrompt(command, message, useYarn = false, runConfigCmd = runConfig) {
    const { config } = await inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'config',
            message: `Error: Could not execute "${command}" due to missing configuration. Would you like to create one?`,
            default: false
        }
    ]);
    if (!config && !process.env.JEST_WORKER_ID) {
        console.log(message);
        return process.exit(0);
    }
    return await runConfigCmd(useYarn, false, true);
}
exports.missingConfigurationPrompt = missingConfigurationPrompt;
