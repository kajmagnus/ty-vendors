/// <reference types="node" />
export default class Runner extends EventEmitter {
    configParser: ConfigParser;
    sigintWasCalled: boolean;
    run({ cid, args, specs, caps, configFile, retries }: string): Promise<any>;
    cid: any;
    specs: any;
    caps: any;
    config: Required<import("@wdio/config").ConfigOptions> | undefined;
    isMultiremote: boolean | undefined;
    reporter: BaseReporter | undefined;
    framework: any;
    inWatchMode: boolean | undefined;
    _initSession(config: object, caps: Object, browserStub: Object): Promise<any>;
    _startSession(config: object, caps: Object): Promise<any>;
    _fetchDriverLogs(config: any, excludeDriverLogs: any): Promise<void[] | undefined>;
    _shutdown(failures: any, retries: any): Promise<any>;
    endSession(): Promise<void>;
}
import EventEmitter from "events";
import { ConfigParser } from "@wdio/config";
import BaseReporter from "./reporter";
//# sourceMappingURL=index.d.ts.map