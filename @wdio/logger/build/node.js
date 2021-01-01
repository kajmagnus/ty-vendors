"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const loglevel_1 = __importDefault(require("loglevel"));
const util_1 = __importDefault(require("util"));
const chalk_1 = __importDefault(require("chalk"));
const loglevel_plugin_prefix_1 = __importDefault(require("loglevel-plugin-prefix"));
const strip_ansi_1 = __importDefault(require("strip-ansi"));
loglevel_plugin_prefix_1.default.reg(loglevel_1.default);
const DEFAULT_LEVEL = 'trace';
const COLORS = {
    error: 'red',
    warn: 'yellow',
    info: 'cyanBright',
    debug: 'green',
    trace: 'cyan'
};
const matches = {
    COMMAND: 'COMMAND',
    DATA: 'DATA',
    RESULT: 'RESULT'
};
const SERIALIZERS = [{
        matches: (err) => err instanceof Error,
        serialize: (err) => err.stack
    }, {
        matches: (log) => log === matches.COMMAND,
        serialize: (log) => chalk_1.default.magenta(log)
    }, {
        matches: (log) => log === matches.DATA,
        serialize: (log) => chalk_1.default.yellow(log)
    }, {
        matches: (log) => log === matches.RESULT,
        serialize: (log) => chalk_1.default.cyan(log)
    }];
const loggers = loglevel_1.default.getLoggers();
let logLevelsConfig = {};
const logCache = new Set();
let logFile;
const originalFactory = loglevel_1.default.methodFactory;
const wdioLoggerMethodFactory = function (methodName, logLevel, loggerName) {
    const rawMethod = originalFactory(methodName, logLevel, loggerName);
    return (...args) => {
        if (!logFile && process.env.WDIO_LOG_PATH) {
            logFile = fs_1.default.createWriteStream(process.env.WDIO_LOG_PATH);
        }
        const match = Object.values(matches).filter(x => args[0].endsWith(`: ${x}`))[0];
        if (match) {
            const prefixStr = args.shift().slice(0, -match.length - 1);
            args.unshift(prefixStr, match);
        }
        args = args.map((arg) => {
            for (const s of SERIALIZERS) {
                if (s.matches(arg)) {
                    return s.serialize(arg);
                }
            }
            return arg;
        });
        const logText = strip_ansi_1.default(`${util_1.default.format.apply(this, args)}\n`);
        if (logFile && logFile.writable) {
            if (logCache.size) {
                logCache.forEach((log) => {
                    if (logFile) {
                        logFile.write(log);
                    }
                });
                logCache.clear();
            }
            return logFile.write(logText);
        }
        logCache.add(logText);
        rawMethod(...args);
    };
};
function getLogger(name) {
    if (loggers[name]) {
        return loggers[name];
    }
    let logLevel = (process.env.WDIO_LOG_LEVEL || DEFAULT_LEVEL);
    const logLevelName = getLogLevelName(name);
    if (logLevelsConfig[logLevelName]) {
        logLevel = logLevelsConfig[logLevelName];
    }
    loggers[name] = loglevel_1.default.getLogger(name);
    loggers[name].setLevel(logLevel);
    loggers[name].methodFactory = wdioLoggerMethodFactory;
    loglevel_plugin_prefix_1.default.apply(loggers[name], {
        template: '%t %l %n:',
        timestampFormatter: (date) => chalk_1.default.gray(date.toISOString()),
        levelFormatter: (level) => chalk_1.default[COLORS[level]](level.toUpperCase()),
        nameFormatter: (name) => chalk_1.default.whiteBright(name)
    });
    return loggers[name];
}
exports.default = getLogger;
getLogger.waitForBuffer = async () => new Promise(resolve => {
    if (logFile && Array.isArray(logFile.writableBuffer) && logFile.writableBuffer.length !== 0) {
        return setTimeout(async () => {
            await getLogger.waitForBuffer();
            resolve();
        }, 20);
    }
    resolve();
});
getLogger.setLevel = (name, level) => loggers[name].setLevel(level);
getLogger.clearLogger = () => {
    if (logFile) {
        logFile.end();
    }
    logFile = null;
};
getLogger.setLogLevelsConfig = (logLevels = {}, wdioLogLevel = DEFAULT_LEVEL) => {
    if (process.env.WDIO_LOG_LEVEL === undefined) {
        process.env.WDIO_LOG_LEVEL = wdioLogLevel;
    }
    logLevelsConfig = {};
    Object.entries(logLevels).forEach(([logName, logLevel]) => {
        const logLevelName = getLogLevelName(logName);
        logLevelsConfig[logLevelName] = logLevel;
    });
    Object.keys(loggers).forEach(logName => {
        const logLevelName = getLogLevelName(logName);
        const logLevel = typeof logLevelsConfig[logLevelName] !== 'undefined' ? logLevelsConfig[logLevelName] : process.env.WDIO_LOG_LEVEL;
        loggers[logName].setLevel(logLevel);
    });
};
const getLogLevelName = (logName) => logName.split(':').shift();
