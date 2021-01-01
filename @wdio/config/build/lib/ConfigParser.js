"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const glob_1 = __importDefault(require("glob"));
const deepmerge_1 = __importDefault(require("deepmerge"));
const logger_1 = __importDefault(require("@wdio/logger"));
const utils_1 = require("../utils");
const constants_1 = require("../constants");
const log = logger_1.default('@wdio/config:ConfigParser');
const MERGE_OPTIONS = { clone: false };
class ConfigParser {
    constructor() {
        this._config = constants_1.DEFAULT_CONFIGS();
        this._capabilities = [];
    }
    addConfigFile(filename) {
        if (typeof filename !== 'string') {
            throw new Error('addConfigFile requires filepath');
        }
        const filePath = path_1.default.resolve(process.cwd(), filename);
        try {
            const fileConfig = deepmerge_1.default(require(filePath).config, {}, MERGE_OPTIONS);
            const defaultTo = Array.isArray(this._capabilities) ? [] : {};
            this._capabilities = deepmerge_1.default(this._capabilities, fileConfig.capabilities || defaultTo, MERGE_OPTIONS);
            delete fileConfig.capabilities;
            this.addService(fileConfig);
            for (let hookName of constants_1.SUPPORTED_HOOKS) {
                delete fileConfig[hookName];
            }
            this._config = deepmerge_1.default(this._config, fileConfig, MERGE_OPTIONS);
            const isRDC = Array.isArray(this._capabilities) && this._capabilities.some(capability => 'testobject_api_key' in capability);
            this._config = deepmerge_1.default(utils_1.detectBackend(this._config, isRDC), this._config, MERGE_OPTIONS);
            delete this._config.watch;
        }
        catch (e) {
            log.error(`Failed loading configuration file: ${filePath}:`, e.message);
            throw e;
        }
    }
    merge(object = {}) {
        const spec = Array.isArray(object.spec) ? object.spec : [];
        const exclude = Array.isArray(object.exclude) ? object.exclude : [];
        this._config = deepmerge_1.default(this._config, object, MERGE_OPTIONS);
        if (object.specs && object.specs.length > 0) {
            this._config.specs = object.specs;
        }
        else if (object.exclude && object.exclude.length > 0) {
            this._config.exclude = object.exclude;
        }
        this._capabilities = utils_1.validObjectOrArray(this._config.capabilities) ? this._config.capabilities : this._capabilities;
        if (this._config.spec && utils_1.isCucumberFeatureWithLineNumber(this._config.spec)) {
            this._config.cucumberFeaturesWithLineNumbers = Array.isArray(this._config.spec) ? [...this._config.spec] : [this._config.spec];
        }
        if (spec.length > 0) {
            this._config.specs = this.setFilePathToFilterOptions(spec, this._config.specs);
        }
        if (exclude.length > 0) {
            this._config.exclude = this.setFilePathToFilterOptions(exclude, this._config.exclude);
        }
        this._config = deepmerge_1.default(utils_1.detectBackend(this._config), this._config, MERGE_OPTIONS);
    }
    addService(service) {
        const addHook = (hookName, hook) => {
            const existingHooks = this._config[hookName];
            if (!existingHooks) {
                this._config[hookName] = hook.bind(service);
            }
            else if (typeof existingHooks === 'function') {
                this._config[hookName] = [existingHooks, hook.bind(service)];
            }
            else {
                this._config[hookName] = [...existingHooks, hook.bind(service)];
            }
        };
        for (const hookName of constants_1.SUPPORTED_HOOKS) {
            const hooksToBeAdded = service[hookName];
            if (!hooksToBeAdded) {
                continue;
            }
            if (typeof hooksToBeAdded === 'function') {
                addHook(hookName, hooksToBeAdded);
            }
            else if (Array.isArray(hooksToBeAdded)) {
                for (const hookToAdd of hooksToBeAdded) {
                    if (typeof hookToAdd === 'function') {
                        addHook(hookName, hookToAdd);
                    }
                }
            }
        }
    }
    getSpecs(capSpecs, capExclude) {
        var _a;
        let specs = ConfigParser.getFilePaths(this._config.specs);
        let spec = Array.isArray(this._config.spec) ? this._config.spec : [];
        let exclude = ConfigParser.getFilePaths(this._config.exclude);
        let suites = Array.isArray(this._config.suite) ? this._config.suite : [];
        if (suites.length > 0) {
            let suiteSpecs = [];
            for (let suiteName of suites) {
                let suite = (_a = this._config.suites) === null || _a === void 0 ? void 0 : _a[suiteName];
                if (!suite) {
                    log.warn(`No suite was found with name "${suiteName}"`);
                }
                if (Array.isArray(suite)) {
                    suiteSpecs = suiteSpecs.concat(ConfigParser.getFilePaths(suite));
                }
            }
            if (suiteSpecs.length === 0) {
                throw new Error(`The suite(s) "${suites.join('", "')}" you specified don't exist ` +
                    'in your config file or doesn\'t contain any files!');
            }
            let tmpSpecs = spec.length > 0 ? [...specs, ...suiteSpecs] : suiteSpecs;
            if (Array.isArray(capSpecs)) {
                tmpSpecs = ConfigParser.getFilePaths(capSpecs);
            }
            if (Array.isArray(capExclude)) {
                exclude = ConfigParser.getFilePaths(capExclude);
            }
            specs = [...new Set(tmpSpecs)];
            return specs.filter(spec => !exclude.includes(spec));
        }
        if (Array.isArray(capSpecs)) {
            specs = ConfigParser.getFilePaths(capSpecs);
        }
        if (Array.isArray(capExclude)) {
            exclude = ConfigParser.getFilePaths(capExclude);
        }
        return specs.filter(spec => !exclude.includes(spec));
    }
    setFilePathToFilterOptions(cliArgFileList, config) {
        const filesToFilter = new Set();
        const fileList = ConfigParser.getFilePaths(config);
        cliArgFileList.forEach(filteredFile => {
            filteredFile = utils_1.removeLineNumbers(filteredFile);
            let globMatchedFiles = ConfigParser.getFilePaths(glob_1.default.sync(filteredFile));
            if (fs_1.default.existsSync(filteredFile) && fs_1.default.lstatSync(filteredFile).isFile()) {
                filesToFilter.add(path_1.default.resolve(process.cwd(), filteredFile));
            }
            else if (globMatchedFiles.length) {
                globMatchedFiles.forEach(file => filesToFilter.add(file));
            }
            else {
                fileList.forEach(file => {
                    if (file.match(filteredFile)) {
                        filesToFilter.add(file);
                    }
                });
            }
        });
        if (filesToFilter.size === 0) {
            throw new Error(`spec file(s) ${cliArgFileList.join(', ')} not found`);
        }
        return [...filesToFilter];
    }
    getConfig() {
        return this._config;
    }
    getCapabilities(i) {
        if (typeof i === 'number' && Array.isArray(this._capabilities) && this._capabilities[i]) {
            return this._capabilities[i];
        }
        return this._capabilities;
    }
    static getFilePaths(patterns, omitWarnings) {
        let files = [];
        if (typeof patterns === 'string') {
            patterns = [patterns];
        }
        if (!Array.isArray(patterns)) {
            throw new Error('specs or exclude property should be an array of strings');
        }
        patterns = patterns.map(pattern => utils_1.removeLineNumbers(pattern));
        for (let pattern of patterns) {
            let filenames = glob_1.default.sync(pattern);
            filenames = filenames.filter((filename) => constants_1.SUPPORTED_FILE_EXTENSIONS.find((ext) => filename.endsWith(ext)));
            filenames = filenames.map(filename => path_1.default.isAbsolute(filename) ? path_1.default.normalize(filename) : path_1.default.resolve(process.cwd(), filename));
            if (filenames.length === 0 && !omitWarnings) {
                log.warn('pattern', pattern, 'did not match any file');
            }
            files = deepmerge_1.default(files, filenames, MERGE_OPTIONS);
        }
        return files;
    }
}
exports.default = ConfigParser;
