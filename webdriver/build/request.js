"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const events_1 = require("events");
const got = __importStar(require("got"));
const logger_1 = __importDefault(require("@wdio/logger"));
const utils_1 = require("@wdio/utils");
const utils_2 = require("./utils");
const pkg = require('../package.json');
const DEFAULT_HEADERS = {
    'Content-Type': 'application/json; charset=utf-8',
    'Connection': 'keep-alive',
    'Accept': 'application/json',
    'User-Agent': 'webdriver/' + pkg.version
};
const log = logger_1.default('webdriver');
const agents = {
    http: new http_1.default.Agent({ keepAlive: true }),
    https: new https_1.default.Agent({ keepAlive: true })
};
class WebDriverRequest extends events_1.EventEmitter {
    constructor(method, endpoint, body, isHubCommand = false) {
        super();
        this.defaultOptions = {
            retry: 0,
            followRedirect: true,
            responseType: 'json',
            throwHttpErrors: false
        };
        this.body = body;
        this.method = method;
        this.endpoint = endpoint;
        this.isHubCommand = isHubCommand;
        this.requiresSessionId = Boolean(this.endpoint.match(/:sessionId/));
    }
    makeRequest(options, sessionId) {
        let fullRequestOptions = Object.assign({
            method: this.method
        }, this.defaultOptions, this._createOptions(options, sessionId));
        if (typeof options.transformRequest === 'function') {
            fullRequestOptions = options.transformRequest(fullRequestOptions);
        }
        this.emit('request', fullRequestOptions);
        return this._request(fullRequestOptions, options.transformResponse, options.connectionRetryCount, 0);
    }
    _createOptions(options, sessionId) {
        const requestOptions = {
            https: {},
            agent: options.agent || agents,
            headers: {
                ...DEFAULT_HEADERS,
                ...(typeof options.headers === 'object' ? options.headers : {})
            },
            searchParams: typeof options.queryParams === 'object' ? options.queryParams : {},
            timeout: options.connectionRetryTimeout
        };
        if (this.body && (Object.keys(this.body).length || this.method === 'POST')) {
            const contentLength = Buffer.byteLength(JSON.stringify(this.body), 'utf8');
            requestOptions.json = this.body;
            requestOptions.headers['Content-Length'] = `${contentLength}`;
        }
        let endpoint = this.endpoint;
        if (this.requiresSessionId) {
            if (!sessionId) {
                throw new Error('A sessionId is required for this command');
            }
            endpoint = endpoint.replace(':sessionId', sessionId);
        }
        requestOptions.url = new URL(`${options.protocol}://` +
            `${options.hostname}:${options.port}` +
            (this.isHubCommand ? this.endpoint : path_1.default.join(options.path || '', endpoint)));
        if (this.endpoint === '/session' && options.user && options.key) {
            requestOptions.username = options.user;
            requestOptions.password = options.key;
        }
        requestOptions.https.rejectUnauthorized = !(options.strictSSL === false ||
            process.env.STRICT_SSL === 'false' ||
            process.env.strict_ssl === 'false');
        return requestOptions;
    }
    async _request(fullRequestOptions, transformResponse, totalRetryCount = 0, retryCount = 0) {
        log.info(`[${fullRequestOptions.method}] ${fullRequestOptions.url.href}`);
        if (fullRequestOptions.json && Object.keys(fullRequestOptions.json).length) {
            log.info('DATA', utils_1.transformCommandLogResult(fullRequestOptions.json));
        }
        const { url, ...gotOptions } = fullRequestOptions;
        let response = await got.default(url, gotOptions)
            .catch((err) => err);
        const retry = (error, msg) => {
            if (retryCount >= totalRetryCount || error.message.includes('invalid session id')) {
                log.error(`Request failed with status ${response.statusCode} due to ${error}`);
                this.emit('response', { error });
                throw error;
            }
            ++retryCount;
            this.emit('retry', { error, retryCount });
            log.warn(msg);
            log.info(`Retrying ${retryCount}/${totalRetryCount}`);
            return this._request(fullRequestOptions, transformResponse, totalRetryCount, retryCount);
        };
        if (response instanceof Error) {
            if (response.code === 'ETIMEDOUT') {
                return retry(response, 'Request timed out! Consider increasing the "connectionRetryTimeout" option.');
            }
            throw response;
        }
        if (typeof transformResponse === 'function') {
            response = transformResponse(response, fullRequestOptions);
        }
        const error = utils_2.getErrorFromResponseBody(response.body);
        if (this.isHubCommand) {
            if (typeof response.body === 'string' && response.body.startsWith('<!DOCTYPE html>')) {
                return Promise.reject(new Error('Command can only be called to a Selenium Hub'));
            }
            return { value: response.body || null };
        }
        if (utils_2.isSuccessfulResponse(response.statusCode, response.body)) {
            this.emit('response', { result: response.body });
            return response.body;
        }
        if (error.name === 'stale element reference') {
            log.warn('Request encountered a stale element - terminating request');
            this.emit('response', { error });
            throw error;
        }
        return retry(error, `Request failed with status ${response.statusCode} due to ${error.message}`);
    }
}
exports.default = WebDriverRequest;
