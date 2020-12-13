import express from 'express';
import { FolderOption, MiddleWareOption } from './types';
export default class StaticServerLauncher {
    folders: FolderOption[] | null;
    port: number;
    middleware: MiddleWareOption[];
    server: express.Express;
    constructor({ folders, port, middleware }: {
        folders?: FolderOption[] | FolderOption;
        port?: number;
        middleware?: MiddleWareOption[];
    });
    onPrepare({ outputDir }: {
        outputDir?: string;
    }): Promise<void>;
}
//# sourceMappingURL=launcher.d.ts.map