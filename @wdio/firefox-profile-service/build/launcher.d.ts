/// <reference types="webdriverio/webdriverio-core" />
/// <reference types="webdriver" />
import { Options } from './types';
export default class FirefoxProfileLauncher {
    private _options;
    private _profile?;
    constructor(_options: Options);
    onPrepare(config: WebdriverIO.Config, capabilities: WebDriver.DesiredCapabilities[] | WebdriverIO.MultiRemoteCapabilities): Promise<void>;
    _setPreferences(): void;
    _buildExtension(capabilities: WebDriver.DesiredCapabilities[] | WebdriverIO.MultiRemoteCapabilities): Promise<void>;
    _setProfile(capability: WebDriver.DesiredCapabilities, zippedProfile: string): void;
}
//# sourceMappingURL=launcher.d.ts.map