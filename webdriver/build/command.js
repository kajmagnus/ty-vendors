"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("@wdio/logger"));
const utils_1 = require("@wdio/utils");
const request_1 = __importDefault(require("./request"));
const log = logger_1.default('webdriver');
function default_1(method, endpointUri, commandInfo, doubleEncodeVariables = false) {
    const { command, ref, parameters, variables = [], isHubCommand = false } = commandInfo;
    return function protocolCommand(...args) {
        let endpoint = endpointUri;
        const commandParams = [...variables.map((v) => Object.assign(v, {
                required: true,
                type: 'string'
            })), ...parameters];
        const commandUsage = `${command}(${commandParams.map((p) => p.name).join(', ')})`;
        const moreInfo = `\n\nFor more info see ${ref}\n`;
        const body = {};
        const minAllowedParams = commandParams.filter((param) => param.required).length;
        if (args.length < minAllowedParams || args.length > commandParams.length) {
            const parameterDescription = commandParams.length
                ? `\n\nProperty Description:\n${commandParams.map((p) => `  "${p.name}" (${p.type}): ${p.description}`).join('\n')}`
                : '';
            throw new Error(`Wrong parameters applied for ${command}\n` +
                `Usage: ${commandUsage}` +
                parameterDescription +
                moreInfo);
        }
        for (const [it, arg] of Object.entries(args)) {
            const i = parseInt(it, 10);
            const commandParam = commandParams[i];
            if (!utils_1.isValidParameter(arg, commandParam.type)) {
                if (typeof arg === 'undefined' && !commandParam.required) {
                    continue;
                }
                const actual = commandParam.type.endsWith('[]')
                    ? `(${(Array.isArray(arg) ? arg : [arg]).map((a) => utils_1.getArgumentType(a))})[]`
                    : utils_1.getArgumentType(arg);
                throw new Error(`Malformed type for "${commandParam.name}" parameter of command ${command}\n` +
                    `Expected: ${commandParam.type}\n` +
                    `Actual: ${actual}` +
                    moreInfo);
            }
            if (i < variables.length) {
                const encodedArg = doubleEncodeVariables ? encodeURIComponent(encodeURIComponent(arg)) : encodeURIComponent(arg);
                endpoint = endpoint.replace(`:${commandParams[i].name}`, encodedArg);
                continue;
            }
            body[commandParams[i].name] = arg;
        }
        const request = new request_1.default(method, endpoint, body, isHubCommand);
        this.emit('command', { method, endpoint, body });
        log.info('COMMAND', utils_1.commandCallStructure(command, args));
        return request.makeRequest(this.options, this.sessionId).then((result) => {
            if (result.value != null) {
                log.info('RESULT', /screenshot|recording/i.test(command)
                    && typeof result.value === 'string' && result.value.length > 64
                    ? `${result.value.substr(0, 61)}...` : result.value);
            }
            this.emit('result', { method, endpoint, body, result });
            if (command === 'deleteSession') {
                logger_1.default.clearLogger();
            }
            return result.value;
        });
    };
}
exports.default = default_1;
