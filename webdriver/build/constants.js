"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULTS = void 0;
exports.DEFAULTS = {
    protocol: {
        type: 'string',
        default: 'http',
        match: /(http|https)/
    },
    hostname: {
        type: 'string',
        default: 'localhost'
    },
    port: {
        type: 'number',
        default: 4444
    },
    path: {
        type: 'string',
        validate: (path) => {
            if (!path.startsWith('/')) {
                throw new TypeError('The option "path" needs to start with a "/"');
            }
            return true;
        },
        default: '/'
    },
    queryParams: {
        type: 'object'
    },
    capabilities: {
        type: 'object',
        required: true
    },
    logLevel: {
        type: 'string',
        default: 'info',
        match: /(trace|debug|info|warn|error|silent)/
    },
    connectionRetryTimeout: {
        type: 'number',
        default: 120000
    },
    connectionRetryCount: {
        type: 'number',
        default: 3
    },
    user: {
        type: 'string'
    },
    key: {
        type: 'string'
    },
    agent: {
        type: 'object'
    },
    logLevels: {
        type: 'object'
    },
    headers: {
        type: 'object'
    },
    transformRequest: {
        type: 'function',
        default: (requestOptions) => requestOptions
    },
    transformResponse: {
        type: 'function',
        default: (response) => response
    },
    directConnectProtocol: {
        type: 'string'
    },
    directConnectHost: {
        type: 'string'
    },
    directConnectPort: {
        type: 'number'
    },
    directConnectPath: {
        type: 'string'
    },
    strictSSL: {
        type: 'boolean',
        default: true
    }
};
