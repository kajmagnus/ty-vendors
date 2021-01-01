"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _chromedriver = _interopRequireDefault(require("chromedriver"));

var _getFilePath = _interopRequireDefault(require("./utils/getFilePath"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_LOG_FILENAME = 'wdio-chromedriver.log';
const DEFAULT_CONNECTION = {
  protocol: 'http',
  hostname: 'localhost',
  port: 9515,
  path: '/'
};

const isMultiremote = obj => typeof obj === 'object' && !Array.isArray(obj);

const isChrome = cap => cap.browserName.toLowerCase() === 'chrome';

class ChromeDriverLauncher {
  constructor(options, capabilities, config) {
    this.options = {
      protocol: options.protocol || DEFAULT_CONNECTION.protocol,
      hostname: options.hostname || DEFAULT_CONNECTION.hostname,
      port: options.port || DEFAULT_CONNECTION.port,
      path: options.path || DEFAULT_CONNECTION.path
    };
    this.outputDir = options.outputDir || config.outputDir;
    this.logFileName = options.logFileName || DEFAULT_LOG_FILENAME;
    this.capabilities = capabilities;
    this.args = options.args || [];
  }

  async onPrepare() {
    this.args.forEach(argument => {
      if (argument.includes('--port')) {
        throw new Error('Argument "--port" already exists');
      }

      if (argument.includes('--url-base')) {
        throw new Error('Argument "--url-base" already exists');
      }
    });
    this.args.push(`--port=${this.options.port}`);
    this.args.push(`--url-base=${this.options.path}`);
    /**
     * update capability connection options to connect
     * to chromedriver
     */

    this._mapCapabilities();

    this.process = await _chromedriver.default.start(this.args, true);

    if (typeof this.outputDir === 'string') {
      this._redirectLogStream();
    }
  }

  onComplete() {
    _chromedriver.default.stop();
  }

  _redirectLogStream() {
    const logFile = (0, _getFilePath.default)(this.outputDir, this.logFileName); // ensure file & directory exists

    _fsExtra.default.ensureFileSync(logFile);

    const logStream = _fsExtra.default.createWriteStream(logFile, {
      flags: 'w'
    });

    this.process.stdout.pipe(logStream);
    this.process.stderr.pipe(logStream);
  }

  _mapCapabilities() {
    if (isMultiremote(this.capabilities)) {
      for (const cap in this.capabilities) {
        if (isChrome(this.capabilities[cap].capabilities)) {
          Object.assign(this.capabilities[cap], this.options);
        }
      }
    } else {
      for (const cap of this.capabilities) {
        if (isChrome(cap)) {
          Object.assign(cap, this.options);
        }
      }
    }
  }

}

exports.default = ChromeDriverLauncher;