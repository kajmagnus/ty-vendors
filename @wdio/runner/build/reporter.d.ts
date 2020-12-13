export default class BaseReporter {
    constructor(config: any, cid: any, caps: any);
    config: any;
    cid: any;
    caps: any;
    reporterSyncInterval: any;
    reporterSyncTimeout: any;
    reporters: any;
    emit(e: string, payload: object): void;
    getLogFile(name: any): string | undefined;
    getWriteStreamObject(reporter: any): {
        write: (content: any) => boolean;
    };
    waitForSync(): Promise<any>;
    initReporter(reporter: any): any;
}
//# sourceMappingURL=reporter.d.ts.map