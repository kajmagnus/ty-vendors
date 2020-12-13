"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const util_1 = require("util");
const express_1 = __importDefault(require("express"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("@wdio/logger"));
const log = logger_1.default('@wdio/static-server-service');
const DEFAULT_LOG_NAME = 'wdio-static-server-service.log';
class StaticServerLauncher {
    constructor({ folders, port = 4567, middleware = [] }) {
        this.folders = folders ? Array.isArray(folders) ? folders : [folders] : null;
        this.port = port;
        this.middleware = middleware;
    }
    async onPrepare({ outputDir }) {
        if (!this.folders) {
            return;
        }
        this.server = express_1.default();
        if (outputDir) {
            const file = path_1.join(outputDir, DEFAULT_LOG_NAME);
            fs_extra_1.default.createFileSync(file);
            const stream = fs_extra_1.default.createWriteStream(file);
            this.server.use(morgan_1.default('tiny', { stream }));
        }
        this.folders.forEach((folder) => {
            log.info('Mounting folder `%s` at `%s`', path_1.resolve(folder.path), folder.mount);
            this.server.use(folder.mount, express_1.default.static(folder.path));
        });
        this.middleware.forEach((ware) => this.server.use(ware.mount, ware.middleware));
        const listen = util_1.promisify(this.server.listen.bind(this.server));
        await listen(this.port);
        log.info(`Static server running at http://localhost:${this.port}`);
    }
}
exports.default = StaticServerLauncher;
