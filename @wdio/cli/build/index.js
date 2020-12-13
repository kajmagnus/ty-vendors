"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yargs_1 = __importDefault(require("yargs"));
const launcher_1 = __importDefault(require("./launcher"));
const run_1 = require("./commands/run");
const constants_1 = require("./constants");
const DEFAULT_CONFIG_FILENAME = 'wdio.conf.js';
const DESCRIPTION = [
    'The `wdio` command allows you run and manage your WebdriverIO test suite.',
    'If no command is provided it calls the `run` command by default, so:',
    '',
    '$ wdio wdio.conf.js',
    '',
    'is the same as:',
    '$ wdio run wdio.conf.js',
    '',
    'For more information, visit: https://webdriver.io/docs/clioptions.html'
];
exports.run = async () => {
    const argv = yargs_1.default
        .commandDir('commands')
        .example('$0 run wdio.conf.js --suite foobar', 'Run suite on testsuite "foobar"')
        .example('$0 run wdio.conf.js --spec ./tests/e2e/a.js --spec ./tests/e2e/b.js', 'Run suite on specific specs')
        .example('$0 run wdio.conf.js --spec ./tests/e2e/a.feature:5', 'Run scenario by line number')
        .example('$0 run wdio.conf.js --spec ./tests/e2e/a.feature:5:10', 'Run scenarios by line number')
        .example('$0 run wdio.conf.js --spec ./tests/e2e/a.feature:5:10 --spec ./test/e2e/b.feature', 'Run scenarios by line number in single feature and another complete feature')
        .example('$0 install reporter spec', 'Install @wdio/spec-reporter')
        .example('$0 repl chrome -u <SAUCE_USERNAME> -k <SAUCE_ACCESS_KEY>', 'Run repl in Sauce Labs cloud')
        .updateStrings({ 'Commands:': `${DESCRIPTION.join('\n')}\n\nCommands:` })
        .epilogue(constants_1.CLI_EPILOGUE);
    if (!process.argv.find((arg) => arg === '--help')) {
        argv.options(run_1.cmdArgs);
    }
    const params = { ...argv.argv };
    const supportedCommands = fs_1.default
        .readdirSync(path_1.default.join(__dirname, 'commands'))
        .map((file) => file.slice(0, -3));
    if (!params._.find((param) => supportedCommands.includes(param))) {
        const args = {
            ...argv.argv,
            configPath: path_1.default.resolve(process.cwd(), argv.argv._[0] && argv.argv._[0].toString() || DEFAULT_CONFIG_FILENAME)
        };
        return run_1.handler(args).catch(async (err) => {
            const output = await new Promise((resolve) => (yargs_1.default.parse('--help', (err, argv, output) => resolve(output))));
            console.error(`${output}\n\n${err.stack}`);
            if (!process.env.JEST_WORKER_ID) {
                process.exit(1);
            }
        });
    }
};
exports.default = launcher_1.default;
