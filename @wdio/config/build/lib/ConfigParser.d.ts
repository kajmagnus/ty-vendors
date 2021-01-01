/// <reference types="webdriver" />
/// <reference types="webdriverio/webdriverio-core" />
/// <reference types="webdriverio" />
/// <reference types="@wdio/cucumber-framework" />
import type { ConfigOptions, Hooks } from '../types';
export default class ConfigParser {
    private _config;
    private _capabilities;
    addConfigFile(filename: string): void;
    merge(object?: Partial<ConfigOptions>): void;
    addService(service: Hooks): void;
    getSpecs(capSpecs?: string[], capExclude?: string[]): string[];
    setFilePathToFilterOptions(cliArgFileList: string[], config: string[]): string[];
    getConfig(): Required<ConfigOptions>;
    getCapabilities(i?: number): WebDriver.DesiredCapabilities | WebDriver.W3CCapabilities | import("webdriverio").MultiRemoteCapabilities | (WebDriver.DesiredCapabilities | WebDriver.W3CCapabilities)[];
    static getFilePaths(patterns: string[], omitWarnings?: boolean): string[];
}
//# sourceMappingURL=ConfigParser.d.ts.map