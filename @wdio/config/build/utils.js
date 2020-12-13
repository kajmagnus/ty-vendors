"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = exports.detectBackend = exports.isCloudCapability = exports.isCucumberFeatureWithLineNumber = exports.removeLineNumbers = exports.getSauceEndpoint = exports.validObjectOrArray = void 0;
const DEFAULT_HOSTNAME = '127.0.0.1';
const DEFAULT_PORT = 4444;
const DEFAULT_PROTOCOL = 'http';
const DEFAULT_PATH = '/';
const LEGACY_PATH = '/wd/hub';
const REGION_MAPPING = {
    'us': 'us-west-1.',
    'eu': 'eu-central-1.',
    'eu-central-1': 'eu-central-1.',
    'us-east-1': 'us-east-1.'
};
exports.validObjectOrArray = (object) => (Array.isArray(object) && object.length > 0) ||
    (typeof object === 'object' && Object.keys(object).length > 0);
function getSauceEndpoint(region, isRDC) {
    const shortRegion = REGION_MAPPING[region] ? region : 'us';
    if (isRDC) {
        return `${shortRegion}1.appium.testobject.com`;
    }
    return `ondemand.${REGION_MAPPING[shortRegion]}saucelabs.com`;
}
exports.getSauceEndpoint = getSauceEndpoint;
function removeLineNumbers(filePath) {
    const matcher = filePath.match(/:\d+(:\d+$|$)/);
    if (matcher) {
        filePath = filePath.substring(0, matcher.index);
    }
    return filePath;
}
exports.removeLineNumbers = removeLineNumbers;
function isCucumberFeatureWithLineNumber(spec) {
    const specs = Array.isArray(spec) ? spec : [spec];
    return specs.some((s) => s.match(/:\d+(:\d+$|$)/));
}
exports.isCucumberFeatureWithLineNumber = isCucumberFeatureWithLineNumber;
function isCloudCapability(capabilities) {
    const caps = capabilities.capabilities || capabilities;
    return Boolean(caps && (caps['bstack:options'] || caps['sauce:options'] || caps['tb:options']));
}
exports.isCloudCapability = isCloudCapability;
function detectBackend(options = {}, isRDC = false) {
    let { port, hostname, user, key, protocol, region, headless, path } = options;
    if (typeof user === 'string' && typeof key === 'string' && key.length === 20) {
        return {
            protocol: protocol || 'https',
            hostname: hostname || 'hub-cloud.browserstack.com',
            port: port || 443,
            path: path || LEGACY_PATH
        };
    }
    if (typeof user === 'string' && typeof key === 'string' && key.length === 32) {
        return {
            protocol: protocol || 'https',
            hostname: hostname || 'hub.testingbot.com',
            port: port || 443,
            path: path || LEGACY_PATH
        };
    }
    if ((typeof user === 'string' && typeof key === 'string' && key.length === 36) ||
        (typeof user === 'string' && isRDC) ||
        isRDC) {
        const sauceRegion = headless ? 'us-east-1' : region;
        return {
            protocol: protocol || 'https',
            hostname: hostname || getSauceEndpoint(sauceRegion, isRDC),
            port: port || 443,
            path: path || LEGACY_PATH
        };
    }
    if ((typeof user === 'string' || typeof key === 'string') &&
        !hostname) {
        throw new Error('A "user" or "key" was provided but could not be connected to a ' +
            'known cloud service (Sauce Labs, Browerstack or Testingbot). ' +
            'Please check if given user and key properties are correct!');
    }
    if (hostname || port || protocol || path) {
        return {
            hostname: hostname || DEFAULT_HOSTNAME,
            port: port || DEFAULT_PORT,
            protocol: protocol || DEFAULT_PROTOCOL,
            path: path || DEFAULT_PATH
        };
    }
    return { hostname, port, protocol, path };
}
exports.detectBackend = detectBackend;
function validateConfig(defaults, options, keysToKeep = []) {
    const params = {};
    for (const [name, expectedOption] of Object.entries(defaults)) {
        if (typeof options[name] === 'undefined' && !expectedOption.default && expectedOption.required) {
            throw new Error(`Required option "${name}" is missing`);
        }
        if (typeof options[name] === 'undefined' && expectedOption.default) {
            params[name] = expectedOption.default;
        }
        if (typeof options[name] !== 'undefined') {
            const optValue = options[name];
            if (typeof optValue !== expectedOption.type) {
                throw new Error(`Expected option "${name}" to be type of ${expectedOption.type} but was ${typeof options[name]}`);
            }
            if (typeof expectedOption.validate === 'function') {
                try {
                    expectedOption.validate(optValue);
                }
                catch (e) {
                    throw new Error(`Type check for option "${name}" failed: ${e.message}`);
                }
            }
            if (typeof optValue === 'string' && expectedOption.match && !optValue.match(expectedOption.match)) {
                throw new Error(`Option "${name}" doesn't match expected values: ${expectedOption.match}`);
            }
            params[name] = options[name];
        }
    }
    for (const [name, option] of Object.entries(options)) {
        if (keysToKeep.includes(name)) {
            params[name] = option;
        }
    }
    return params;
}
exports.validateConfig = validateConfig;
