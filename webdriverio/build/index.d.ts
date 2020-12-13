import WebDriver from 'webdriver';
import SevereServiceErrorImport from './utils/SevereServiceError';
import type { Options, MultiRemoteOptions } from './types';
export declare const remote: (params?: Options, remoteModifier?: Function | undefined) => Promise<any>;
export declare const attach: (params: WebDriver.AttachSessionOptions) => Promise<WebDriver.Client>;
export declare const multiremote: (params: MultiRemoteOptions, { automationProtocol }?: Options) => Promise<any>;
export declare const SevereServiceError: typeof SevereServiceErrorImport;
//# sourceMappingURL=index.d.ts.map