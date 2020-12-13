"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.launch = exports.launchWithStdin = exports.builder = exports.cmdArgs = exports.desc = exports.command = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const launcher_1 = __importDefault(require("../launcher"));
const watcher_1 = __importDefault(require("../watcher"));
const constants_1 = require("../constants");
exports.command = 'run <configPath>';
exports.desc = 'Run your WDIO configuration file to initialize your tests. (default)';
exports.cmdArgs = {
    watch: {
        desc: 'Run WebdriverIO in watch mode',
        type: 'boolean',
    },
    hostname: {
        alias: 'h',
        desc: 'automation driver host address',
        type: 'string'
    },
    port: {
        alias: 'p',
        desc: 'automation driver port',
        type: 'number'
    },
    path: {
        type: 'string',
        desc: 'path to WebDriver endpoints (default "/")'
    },
    user: {
        alias: 'u',
        desc: 'username if using a cloud service as automation backend',
        type: 'string'
    },
    key: {
        alias: 'k',
        desc: 'corresponding access key to the user',
        type: 'string'
    },
    logLevel: {
        alias: 'l',
        desc: 'level of logging verbosity',
        choices: ['trace', 'debug', 'info', 'warn', 'error', 'silent']
    },
    bail: {
        desc: 'stop test runner after specific amount of tests have failed',
        type: 'number'
    },
    baseUrl: {
        desc: 'shorten url command calls by setting a base url',
        type: 'string'
    },
    waitforTimeout: {
        alias: 'w',
        desc: 'timeout for all waitForXXX commands',
        type: 'number'
    },
    framework: {
        alias: 'f',
        desc: 'defines the framework (Mocha, Jasmine or Cucumber) to run the specs',
        type: 'string'
    },
    reporters: {
        alias: 'r',
        desc: 'reporters to print out the results on stdout',
        type: 'array'
    },
    suite: {
        desc: 'overwrites the specs attribute and runs the defined suite',
        type: 'array'
    },
    spec: {
        desc: 'run only a certain spec file - overrides specs piped from stdin',
        type: 'array'
    },
    exclude: {
        desc: 'exclude certain spec file from the test run - overrides exclude piped from stdin',
        type: 'array'
    },
    mochaOpts: {
        desc: 'Mocha options'
    },
    jasmineNodeOpts: {
        desc: 'Jasmine options'
    },
    cucumberOpts: {
        desc: 'Cucumber options'
    }
};
exports.builder = (yargs) => {
    return yargs
        .options(exports.cmdArgs)
        .example('$0 run wdio.conf.js --suite foobar', 'Run suite on testsuite "foobar"')
        .example('$0 run wdio.conf.js --spec ./tests/e2e/a.js --spec ./tests/e2e/b.js', 'Run suite on specific specs')
        .example('$0 run wdio.conf.js --mochaOpts.timeout 60000', 'Run suite with custom Mocha timeout')
        .epilogue(constants_1.CLI_EPILOGUE)
        .help();
};
function launchWithStdin(wdioConfPath, params) {
    let stdinData = '';
    const stdin = process.openStdin();
    stdin.setEncoding('utf8');
    stdin.on('data', (data) => {
        stdinData += data;
    });
    stdin.on('end', () => {
        if (stdinData.length > 0) {
            params.spec = stdinData.trim().split(/\r?\n/);
        }
        launch(wdioConfPath, params);
    });
}
exports.launchWithStdin = launchWithStdin;
function launch(wdioConfPath, params) {
    const launcher = new launcher_1.default(wdioConfPath, params);
    return launcher.run()
        .then((...args) => {
        if (!process.env.JEST_WORKER_ID) {
            process.exit(...args);
        }
    })
        .catch(err => {
        console.error(err);
        if (!process.env.JEST_WORKER_ID) {
            process.exit(1);
        }
    });
}
exports.launch = launch;
async function handler(argv) {
    const { configPath, ...params } = argv;
    if (!fs_extra_1.default.existsSync(configPath)) {
        await config_1.missingConfigurationPrompt('run', `No WebdriverIO configuration found in "${process.cwd()}"`);
    }
    const localConf = path_1.default.join(process.cwd(), 'wdio.conf.js');
    const wdioConf = configPath || (fs_extra_1.default.existsSync(localConf) ? localConf : undefined);
    if (params.watch) {
        const watcher = new watcher_1.default(wdioConf, params);
        return watcher.watch();
    }
    if (process.stdin.isTTY || !process.stdout.isTTY) {
        return launch(wdioConf, params);
    }
    launchWithStdin(wdioConf, params);
}
exports.handler = handler;
