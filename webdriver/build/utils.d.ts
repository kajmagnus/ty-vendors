import { WebDriverResponse } from './request';
import { Options, JSONWPCommandError, SessionFlags, DesiredCapabilities } from './types';
export declare function startWebDriverSession(params: Options): Promise<{
    sessionId: string;
    capabilities: DesiredCapabilities;
}>;
export declare function isSuccessfulResponse(statusCode?: number, body?: WebDriverResponse): boolean;
export declare function getPrototype({ isW3C, isChrome, isMobile, isSauce, isSeleniumStandalone }: Partial<SessionFlags>): Record<string, PropertyDescriptor>;
export declare function getErrorFromResponseBody(body: any): Error;
export declare class CustomRequestError extends Error {
    constructor(body: WebDriverResponse);
}
export declare function getEnvironmentVars({ isW3C, isMobile, isIOS, isAndroid, isChrome, isSauce, isSeleniumStandalone }: Partial<SessionFlags>): {
    isW3C: {
        value: boolean | undefined;
    };
    isMobile: {
        value: boolean | undefined;
    };
    isIOS: {
        value: boolean | undefined;
    };
    isAndroid: {
        value: boolean | undefined;
    };
    isChrome: {
        value: boolean | undefined;
    };
    isSauce: {
        value: boolean | undefined;
    };
    isSeleniumStandalone: {
        value: boolean | undefined;
    };
};
export declare const getSessionError: (err: JSONWPCommandError, params?: Partial<Options>) => string;
//# sourceMappingURL=utils.d.ts.map