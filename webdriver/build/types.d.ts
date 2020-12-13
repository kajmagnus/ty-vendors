/// <reference types="node" />
import * as got from 'got';
import http from 'http';
import https from 'https';
import { EventEmitter } from 'events';
export declare type PageLoadingStrategy = 'none' | 'eager' | 'normal';
export declare type ProxyTypes = 'pac' | 'noproxy' | 'autodetect' | 'system' | 'manual';
export declare type WebDriverLogTypes = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';
export declare type LoggingPreferenceType = 'OFF' | 'SEVERE' | 'WARNING' | 'INFO' | 'CONFIG' | 'FINE' | 'FINER' | 'FINEST' | 'ALL';
export declare type FirefoxLogLevels = 'trace' | 'debug' | 'config' | 'info' | 'warn' | 'error' | 'fatal';
export declare type Timeouts = Record<'script' | 'pageLoad' | 'implicit', number>;
export declare type SameSiteOptions = 'Lax' | 'Strict';
export interface ProxyObject {
    proxyType?: ProxyTypes;
    proxyAutoconfigUrl?: string;
    ftpProxy?: string;
    ftpProxyPort?: number;
    httpProxy?: string;
    httpProxyPort?: number;
    sslProxy?: string;
    sslProxyPort?: number;
    socksProxy?: string;
    socksProxyPort?: number;
    socksVersion?: string;
    socksUsername?: string;
    socksPassword?: string;
}
export interface LoggingPreferences {
    browser?: LoggingPreferenceType;
    driver?: LoggingPreferenceType;
    server?: LoggingPreferenceType;
    client?: LoggingPreferenceType;
}
export interface Cookie {
    name: string;
    value: string;
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    expiry?: number;
    sameSite?: SameSiteOptions;
}
export interface ChromeOptions {
    args?: string[];
    binary?: string;
    extensions?: string[];
    localState?: {
        [name: string]: any;
    };
    detach?: boolean;
    debuggerAddress?: string;
    excludeSwitches?: string[];
    minidumpPath?: string;
    mobileEmulation?: {
        [name: string]: any;
    };
    perfLoggingPrefs?: {
        enableNetwork?: boolean;
        enablePage?: boolean;
        enableTimeline?: boolean;
        tracingCategories?: boolean;
        bufferUsageReportingInterval?: boolean;
    };
    prefs?: {
        [name: string]: string | number | boolean;
    };
    windowTypes?: string[];
}
interface MicrosoftEdgeOptions extends ChromeOptions {
}
export interface FirefoxLogObject {
    level: FirefoxLogLevels;
}
export interface GeckodriverCapabilities {
    'firefox_binary'?: string;
    firefoxProfileTemplate?: string;
    captureNetworkTraffic?: boolean;
    addCustomRequestHeaders?: boolean;
    trustAllSSLCertificates?: boolean;
    changeMaxConnections?: boolean;
    profile?: string;
    pageLoadingStrategy?: string;
}
export interface FirefoxOptions {
    debuggerAddress?: string;
    binary?: string;
    args?: string[];
    profile?: string;
    log?: FirefoxLogObject;
    prefs?: {
        [name: string]: string | number | boolean;
    };
}
export interface SelenoidOptions {
    enableVNC?: boolean;
    screenResolution?: string;
    enableVideo?: boolean;
    videoName?: string;
    videoScreenSize?: string;
    videoFrameRate?: number;
    videoCodec?: string;
    enableLog?: boolean;
    logName?: string;
    name?: string;
    sessionTimeout?: string;
    timeZone?: string;
    env?: string[];
    applicationContainers?: string[];
    hostsEntries?: string[];
    dnsServers?: string[];
    additionalNetworks?: string[];
    labels?: Map<string, string>;
    skin?: string;
    s3KeyPattern?: string;
}
export interface Capabilities extends VendorExtensions {
    browserName?: string;
    browserVersion?: string;
    platformName?: string;
    acceptInsecureCerts?: boolean;
    pageLoadStrategy?: PageLoadingStrategy;
    proxy?: ProxyObject;
    setWindowRect?: boolean;
    timeouts?: Timeouts;
    strictFileInteractability?: boolean;
    unhandledPromptBehavior?: string;
}
export interface W3CCapabilities {
    alwaysMatch: Capabilities;
    firstMatch: Capabilities[];
}
export interface DesiredCapabilities extends Capabilities, SauceLabsCapabilities, SauceLabsVisualCapabilities, TestingbotCapabilities, SeleniumRCCapabilities, AppiumIOSCapabilities, GeckodriverCapabilities, IECapabilities, AppiumAndroidCapabilities, AppiumCapabilities, VendorExtensions, GridCapabilities, ChromeCapabilities {
    cssSelectorsEnabled?: boolean;
    handlesAlerts?: boolean;
    version?: string;
    platform?: string;
    public?: any;
    loggingPrefs?: {
        browser?: LoggingPreferences;
        driver?: LoggingPreferences;
        server?: LoggingPreferences;
        client?: LoggingPreferences;
    };
    javascriptEnabled?: boolean;
    databaseEnabled?: boolean;
    locationContextEnabled?: boolean;
    applicationCacheEnabled?: boolean;
    browserConnectionEnabled?: boolean;
    webStorageEnabled?: boolean;
    acceptSslCerts?: boolean;
    rotatable?: boolean;
    nativeEvents?: boolean;
    unexpectedAlertBehaviour?: string;
    elementScrollBehavior?: number;
    'webdriver.remote.sessionid'?: string;
    'webdriver.remote.quietExceptions'?: boolean;
    'selenium.server.url'?: string;
    specs?: string[];
    exclude?: string[];
}
export interface VendorExtensions extends EdgeCapabilities {
    'selenoid:options'?: SelenoidOptions;
    'tb:options'?: TestingbotCapabilities;
    'sauce:options'?: SauceLabsCapabilities;
    'sauce:visual'?: SauceLabsVisualCapabilities;
    'bstack:options'?: {
        [name: string]: any;
    };
    'goog:chromeOptions'?: ChromeOptions;
    'moz:firefoxOptions'?: FirefoxOptions;
    firefox_profile?: string;
    'ms:edgeOptions'?: MicrosoftEdgeOptions;
    'ms:edgeChromium'?: MicrosoftEdgeOptions;
    'safari.options'?: {
        [name: string]: any;
    };
}
export interface GridCapabilities {
    seleniumProtocol?: string;
    maxInstances?: number;
    environment?: string;
}
export interface EdgeCapabilities {
    'ms:inPrivate'?: boolean;
    'ms:extensionPaths'?: string[];
    'ms:startPage'?: string;
}
export interface ChromeCapabilities {
    chrome?: string;
    chromeOptions?: ChromeOptions;
    mobileEmulationEnabled?: boolean;
}
export interface AppiumCapabilities {
    automationName?: string;
    'appium:automationName'?: string;
    platformVersion?: string;
    'appium:platformVersion'?: string;
    deviceName?: string;
    'appium:deviceName'?: string;
    app?: string;
    'appium:app'?: string;
    newCommandTimeout?: number;
    'appium:newCommandTimeout'?: number;
    language?: string;
    'appium:language'?: string;
    locale?: string;
    'appium:locale'?: string;
    udid?: string;
    'appium:udid'?: string;
    orientation?: string;
    'appium:orientation'?: string;
    autoWebview?: boolean;
    'appium:autoWebview'?: boolean;
    noReset?: boolean;
    'appium:noReset'?: boolean;
    fullReset?: boolean;
    'appium:fullReset'?: boolean;
    eventTimings?: boolean;
    'appium:eventTimings'?: boolean;
    enablePerformanceLogging?: boolean;
    'appium:enablePerformanceLogging'?: boolean;
    printPageSourceOnFindFailure?: boolean;
    'appium:printPageSourceOnFindFailure'?: boolean;
}
export interface AppiumAndroidCapabilities {
    appiumVersion?: string;
    appActivity?: string;
    appPackage?: string;
    appWaitActivity?: string;
    appWaitPackage?: string;
    appWaitDuration?: number;
    deviceReadyTimeout?: number;
    allowTestPackages?: boolean;
    androidCoverage?: string;
    androidCoverageEndIntent?: string;
    androidDeviceReadyTimeout?: number;
    androidInstallTimeout?: number;
    androidInstallPath?: string;
    adbPort?: number;
    systemPort?: number;
    remoteAdbHost?: string;
    androidDeviceSocket?: string;
    avd?: string;
    avdLaunchTimeout?: number;
    avdReadyTimeout?: number;
    avdArgs?: string;
    useKeystore?: boolean;
    keystorePath?: string;
    keystorePassword?: string;
    keyAlias?: string;
    keyPassword?: string;
    chromedriverExecutable?: string;
    chromedriverArgs?: string[];
    chromedriverExecutableDir?: string;
    chromedriverChromeMappingFile?: string;
    chromedriverUseSystemExecutable?: boolean;
    autoWebviewTimeout?: number;
    chromedriverPort?: number;
    chromedriverPorts?: (number | number[])[];
    intentAction?: string;
    intentCategory?: string;
    intentFlags?: string;
    optionalIntentArguments?: string;
    dontStopAppOnReset?: boolean;
    unicodeKeyboard?: boolean;
    resetKeyboard?: boolean;
    noSign?: boolean;
    ignoreUnimportantViews?: boolean;
    disableAndroidWatchers?: boolean;
    recreateChromeDriverSessions?: boolean;
    nativeWebScreenshot?: boolean;
    androidScreenshotPath?: string;
    autoGrantPermissions?: boolean;
    networkSpeed?: string;
    gpsEnabled?: boolean;
    isHeadless?: boolean;
    adbExecTimeout?: number;
    localeScript?: string;
    skipDeviceInitialization?: boolean;
    chromedriverDisableBuildCheck?: boolean;
    skipUnlock?: boolean;
    unlockType?: string;
    unlockKey?: string;
    autoLaunch?: boolean;
    skipLogcatCapture?: boolean;
    uninstallOtherPackages?: string;
    disableWindowAnimation?: boolean;
    otherApps?: string;
    uiautomator2ServerLaunchTimeout?: number;
    uiautomator2ServerInstallTimeout?: number;
    skipServerInstallation?: boolean;
    espressoServerLaunchTimeout?: number;
}
export interface AppiumIOSCapabilities {
    calendarFormat?: string;
    bundleId?: string;
    launchTimeout?: number;
    locationServicesEnabled?: boolean;
    locationServicesAuthorized?: boolean;
    autoAcceptAlerts?: boolean;
    autoDismissAlerts?: boolean;
    nativeInstrumentsLib?: boolean;
    nativeWebTap?: boolean;
    safariInitialUrl?: string;
    safariAllowPopups?: boolean;
    safariIgnoreFraudWarning?: boolean;
    safariOpenLinksInBackground?: boolean;
    keepKeyChains?: boolean;
    localizableStringsDir?: string;
    processArguments?: string;
    interKeyDelay?: number;
    showIOSLog?: boolean;
    sendKeyStrategy?: string;
    screenshotWaitTimeout?: number;
    waitForAppScript?: string;
    webviewConnectRetries?: number;
    appName?: string;
    customSSLCert?: string;
    webkitResponseTimeout?: number;
    remoteDebugProxy?: string;
    enableAsyncExecuteFromHttps?: boolean;
    skipLogCapture?: boolean;
    webkitDebugProxyPort?: number;
}
export interface IECapabilities {
    'ie.forceCreateProcessApi'?: boolean;
    'ie.browserCommandLineSwitches'?: string;
    'ie.usePerProcessProxy'?: boolean;
    'ie.ensureCleanSession'?: boolean;
    'ie.setProxyByServer'?: boolean;
    'ie.fileUploadDialogTimeout'?: number;
    'ie.edgechromium'?: boolean;
    'ie.edgepath'?: string;
    ignoreProtectedModeSettings?: boolean;
    ignoreZoomSetting?: boolean;
    initialBrowserUrl?: string;
    enablePersistentHover?: boolean;
    enableElementCacheCleanup?: boolean;
    requireWindowFocus?: boolean;
    browserAttachTimeout?: number;
    logFile?: string;
    logLevel?: string;
    host?: string;
    extractPath?: string;
    silent?: string;
    killProcessesByName?: boolean;
}
export interface SauceLabsCapabilities {
    tunnelIdentifier?: string;
    parentTunnel?: string;
    screenResolution?: string;
    timeZone?: string;
    avoidProxy?: boolean;
    public?: string;
    prerun?: {
        executable: string;
        args: string[];
        background: boolean;
        timeout: number;
    };
    recordVideo?: boolean;
    videoUploadOnPass?: boolean;
    recordScreenshots?: boolean;
    recordLogs?: boolean;
    priority?: number;
    extendedDebugging?: boolean;
    capturePerformance?: boolean;
    seleniumVersion?: string;
    chromedriverVersion?: string;
    iedriverVersion?: string;
    maxDuration?: number;
    commandTimeout?: number;
    idleTimeout?: number;
}
export interface SauceLabsVisualCapabilities {
    projectName?: string;
    apiKey?: string;
    viewportSize?: string;
    branch?: string;
    baseBranch?: string;
    diffOptions?: {
        structure?: boolean;
        layout?: boolean;
        style?: boolean;
        content?: boolean;
        minLayoutPosition?: number;
        minLayoutDimension?: number;
    };
    ignore?: string;
    failOnNewStates?: boolean;
    alwaysAcceptBaseBranch?: boolean;
    disableBranchBaseline?: boolean;
    scrollAndStitchScreenshots?: boolean;
    disableCORS?: boolean;
}
export interface TestingbotCapabilities {
    public?: boolean;
}
export interface SeleniumRCCapabilities {
    commandLineFlags?: string;
    executablePath?: string;
    timeoutInSeconds?: number;
    onlyProxySeleniumTraffic?: boolean;
    avoidProxy?: boolean;
    proxyEverything?: boolean;
    proxyRequired?: boolean;
    browserSideLog?: boolean;
    optionsSet?: boolean;
    singleWindow?: boolean;
    dontInjectRegex?: RegExp;
    userJSInjection?: boolean;
    userExtensions?: string;
}
export interface Options {
    protocol?: string;
    hostname?: string;
    port?: number;
    path?: string;
    queryParams?: {
        [name: string]: string;
    };
    user?: string;
    key?: string;
    capabilities?: DesiredCapabilities | W3CCapabilities;
    requestedCapabilities?: DesiredCapabilities | W3CCapabilities;
    logLevel?: WebDriverLogTypes;
    logLevels?: Record<string, WebDriverLogTypes | undefined>;
    connectionRetryTimeout?: number;
    connectionRetryCount?: number;
    headers?: {
        [name: string]: string;
    };
    agent?: {
        http: http.Agent;
        https: https.Agent;
    };
    transformRequest?: (requestOptions: got.HTTPSOptions) => got.HTTPSOptions;
    transformResponse?: (response: got.Response, requestOptions: got.HTTPSOptions) => got.Response;
    directConnectProtocol?: string;
    directConnectHost?: string;
    directConnectPort?: number;
    directConnectPath?: string;
    strictSSL?: boolean;
    outputDir?: string;
}
export interface JSONWPCommandError extends Error {
    code?: string;
    statusCode?: string;
    statusMessage?: string;
}
export interface SessionFlags {
    isW3C: boolean;
    isChrome: boolean;
    isAndroid: boolean;
    isMobile: boolean;
    isIOS: boolean;
    isSauce: boolean;
    isSeleniumStandalone: boolean;
}
export interface BaseClient extends EventEmitter, SessionFlags {
    sessionId: string;
    capabilities: DesiredCapabilities | W3CCapabilities;
    requestedCapabilities: DesiredCapabilities | W3CCapabilities;
    options: Options;
}
export interface Client extends BaseClient {
}
export interface ClientAsync extends AsyncClient, BaseClient {
}
declare type AsyncClient = {
    [K in keyof Pick<Client, Exclude<keyof Client, keyof BaseClient>>]: (...args: Parameters<Client[K]>) => Promise<ReturnType<Client[K]>>;
};
export interface AttachOptions extends Partial<SessionFlags>, Partial<Options> {
    sessionId: string;
    capabilities?: DesiredCapabilities;
    isW3C?: boolean;
}
// object with no match
interface ProtocolCommandResponse {
    [key: string]: any;
}

// webdriver.json
interface SessionReturn extends DesiredCapabilities, ProtocolCommandResponse { }

interface StatusReturn extends ProtocolCommandResponse {
    ready?: boolean,
    message?: string,
}

type ElementReferenceId = 'element-6066-11e4-a52e-4f735466cecf'
type ElementReference = Record<ElementReferenceId, string>

interface WindowHandle {
    handle: string,
    type: string
}

interface RectReturn {
    x: number,
    y: number,
    width: number,
    height: number
}

// appium.json
interface StringsReturn {
    [key: string]: string
}

interface SettingsReturn extends ProtocolCommandResponse {
    shouldUseCompactResponses?: boolean,
    elementResponseAttributes?: string,
    ignoreUnimportantViews?: boolean,
    allowInvisibleElements?: boolean,
    enableNotificationListener?: boolean,
    actionAcknowledgmentTimeout?: number,
    keyInjectionDelay?: number,
    scrollAcknowledgmentTimeout?: number,
    waitForIdleTimeout?: number,
    waitForSelectorTimeout?: number,
    normalizeTagNames?: boolean,
    shutdownOnPowerDisconnect?: boolean,
    mjpegServerScreenshotQuality?: number,
    mjpegServerFramerate?: number,
    screenshotQuality?: number,
    mjpegScalingFactor?: number,
}

// generated typings
// webdriver types
interface Client extends BaseClient {

    /**
     * [webdriver]
     * The New Session command creates a new WebDriver session with the endpoint node. If the creation fails, a session not created error is returned.
     * https://w3c.github.io/webdriver/#dfn-new-sessions
     */
    newSession(capabilities: object): SessionReturn;

    /**
     * [webdriver]
     * The Delete Session command closes any top-level browsing contexts associated with the current session, terminates the connection, and finally closes the current session.
     * https://w3c.github.io/webdriver/#dfn-delete-session
     */
    deleteSession(): void;

    /**
     * [webdriver]
     * The Status command returns information about whether a remote end is in a state in which it can create new sessions and can additionally include arbitrary meta information that is specific to the implementation.
     * https://w3c.github.io/webdriver/#dfn-status
     */
    status(): StatusReturn;

    /**
     * [webdriver]
     * The Get Timeouts command gets timeout durations associated with the current session.
     * https://w3c.github.io/webdriver/#dfn-get-timeouts
     */
    getTimeouts(): Timeouts;

    /**
     * [webdriver]
     * The Set Timeouts command sets timeout durations associated with the current session. The timeouts that can be controlled are listed in the table of session timeouts below.
     * https://w3c.github.io/webdriver/#dfn-set-timeouts
     */
    setTimeouts(implicit?: number, pageLoad?: number, script?: number): void;

    /**
     * [webdriver]
     * The Get Current URL command returns the URL of the current top-level browsing context.
     * https://w3c.github.io/webdriver/#dfn-get-current-url
     */
    getUrl(): string;

    /**
     * [webdriver]
     * The navigateTo (go) command is used to cause the user agent to navigate the current top-level browsing context a new location.
     * https://w3c.github.io/webdriver/#dfn-navigate-to
     */
    navigateTo(url: string): string;

    /**
     * [webdriver]
     * The Back command causes the browser to traverse one step backward in the joint session history of the current top-level browsing context. This is equivalent to pressing the back button in the browser chrome or calling `window.history.back`.
     * https://w3c.github.io/webdriver/#dfn-back
     */
    back(): void;

    /**
     * [webdriver]
     * The Forward command causes the browser to traverse one step forwards in the joint session history of the current top-level browsing context.
     * https://w3c.github.io/webdriver/#dfn-forward
     */
    forward(): void;

    /**
     * [webdriver]
     * The Refresh command causes the browser to reload the page in current top-level browsing context.
     * https://w3c.github.io/webdriver/#dfn-refresh
     */
    refresh(): void;

    /**
     * [webdriver]
     * The Get Title command returns the document title of the current top-level browsing context, equivalent to calling `document.title`.
     * https://w3c.github.io/webdriver/#dfn-get-title
     */
    getTitle(): string;

    /**
     * [webdriver]
     * The Get Window Handle command returns the window handle for the current top-level browsing context. It can be used as an argument to Switch To Window.
     * https://w3c.github.io/webdriver/#dfn-get-window-handle
     */
    getWindowHandle(): string;

    /**
     * [webdriver]
     * The Close Window command closes the current top-level browsing context. Once done, if there are no more top-level browsing contexts open, the WebDriver session itself is closed.
     * https://w3c.github.io/webdriver/#dfn-close-window
     */
    closeWindow(): void;

    /**
     * [webdriver]
     * The Switch To Window command is used to select the current top-level browsing context for the current session, i.e. the one that will be used for processing commands.
     * https://w3c.github.io/webdriver/#dfn-switch-to-window
     */
    switchToWindow(handle: string): void;

    /**
     * [webdriver]
     * Create a new top-level browsing context.
     * https://w3c.github.io/webdriver/#new-window
     */
    createWindow(type: 'tab' | 'window'): WindowHandle;

    /**
     * [webdriver]
     * The Get Window Handles command returns a list of window handles for every open top-level browsing context. The order in which the window handles are returned is arbitrary.
     * https://w3c.github.io/webdriver/#dfn-get-window-handles
     */
    getWindowHandles(): string[];

    /**
     * [webdriver]
     * The Print Page command renders the document to a paginated PDF document.
     * https://w3c.github.io/webdriver/#print-page
     */
    printPage(orientation?: string, scale?: number, background?: boolean, width?: number, height?: number, top?: number, bottom?: number, left?: number, right?: number, shrinkToFit?: boolean, pageRanges?: object[]): string;

    /**
     * [webdriver]
     * The Switch To Frame command is used to select the current top-level browsing context or a child browsing context of the current browsing context to use as the current browsing context for subsequent commands.
     * https://w3c.github.io/webdriver/#dfn-switch-to-frame
     */
    switchToFrame(id: (number|object|null)): void;

    /**
     * [webdriver]
     * The Switch to Parent Frame command sets the current browsing context for future commands to the parent of the current browsing context.
     * https://w3c.github.io/webdriver/#dfn-switch-to-parent-frame
     */
    switchToParentFrame(): void;

    /**
     * [webdriver]
     * The Get Window Rect command returns the size and position on the screen of the operating system window corresponding to the current top-level browsing context.
     * https://w3c.github.io/webdriver/#dfn-get-window-rect
     */
    getWindowRect(): RectReturn;

    /**
     * [webdriver]
     * The Set Window Rect command alters the size and the position of the operating system window corresponding to the current top-level browsing context.
     * https://w3c.github.io/webdriver/#dfn-set-window-rect
     */
    setWindowRect(x: (number|null), y: (number|null), width: (number|null), height: (number|null)): RectReturn;

    /**
     * [webdriver]
     * The Maximize Window command invokes the window manager-specific "maximize" operation, if any, on the window containing the current top-level browsing context. This typically increases the window to the maximum available size without going full-screen.
     * https://w3c.github.io/webdriver/#dfn-maximize-window
     */
    maximizeWindow(): RectReturn;

    /**
     * [webdriver]
     * The Minimize Window command invokes the window manager-specific "minimize" operation, if any, on the window containing the current top-level browsing context. This typically hides the window in the system tray.
     * https://w3c.github.io/webdriver/#dfn-minimize-window
     */
    minimizeWindow(): RectReturn;

    /**
     * [webdriver]
     * The Fullscreen Window command invokes the window manager-specific “full screen” operation, if any, on the window containing the current top-level browsing context. This typically increases the window to the size of the physical display and can hide browser chrome elements such as toolbars.
     * https://w3c.github.io/webdriver/#dfn-fullscreen-window
     */
    fullscreenWindow(): RectReturn;

    /**
     * [webdriver]
     * The Find Element command is used to find an element in the current browsing context that can be used for future commands.
     * https://w3c.github.io/webdriver/#dfn-find-element
     */
    findElement(using: string, value: string): webdriver.elementreference[];

    /**
     * [webdriver]
     * The Find Elements command is used to find elements in the current browsing context that can be used for future commands.
     * https://w3c.github.io/webdriver/#dfn-find-elements
     */
    findElements(using: string, value: string): webdriver.elementreference[];

    /**
     * [webdriver]
     * The Find Element From Element command is used to find an element from a web element in the current browsing context that can be used for future commands.
     * https://w3c.github.io/webdriver/#dfn-find-element-from-element
     */
    findElementFromElement(elementId: string, using: string, value: string): webdriver.elementreference;

    /**
     * [webdriver]
     * The Find Elements From Element command is used to find elements from a web element in the current browsing context that can be used for future commands.
     * https://w3c.github.io/webdriver/#dfn-find-elements-from-element
     */
    findElementsFromElement(elementId: string, using: string, value: string): webdriver.elementreference[];

    /**
     * [webdriver]
     * Get Active Element returns the active element of the current browsing context’s document element.
     * https://w3c.github.io/webdriver/#dfn-get-active-element
     */
    getActiveElement(): string;

    /**
     * [webdriver]
     * Is Element Selected determines if the referenced element is selected or not. This operation only makes sense on input elements of the Checkbox- and Radio Button states, or option elements.
     * https://w3c.github.io/webdriver/#dfn-is-element-selected
     */
    isElementSelected(elementId: string): boolean;

    /**
     * [webdriver]
     * Is Element Displayed determines the visibility of an element which is guided by what is perceptually visible to the human eye. In this context, an element's displayedness does not relate to the `visibility` or `display` style properties.
     * https://w3c.github.io/webdriver/#element-displayedness
     */
    isElementDisplayed(elementId: string): boolean;

    /**
     * [webdriver]
     * The Get Element Attribute command will return the attribute of a web element.
     * https://w3c.github.io/webdriver/#dfn-get-element-attribute
     */
    getElementAttribute(elementId: string, name: string): string;

    /**
     * [webdriver]
     * The Get Element Property command will return the result of getting a property of an element.
     * https://w3c.github.io/webdriver/#dfn-get-element-property
     */
    getElementProperty(elementId: string, name: string): string;

    /**
     * [webdriver]
     * The Get Element CSS Value command retrieves the computed value of the given CSS property of the given web element.
     * https://w3c.github.io/webdriver/#dfn-get-element-css-value
     */
    getElementCSSValue(elementId: string, propertyName: string): string;

    /**
     * [webdriver]
     * The Get Element Text command intends to return an element’s text "as rendered". An element's rendered text is also used for locating a elements by their link text and partial link text.
     * https://w3c.github.io/webdriver/#dfn-get-element-text
     */
    getElementText(elementId: string): string;

    /**
     * [webdriver]
     * The Get Element Tag Name command returns the qualified element name of the given web element.
     * https://w3c.github.io/webdriver/#dfn-get-element-tag-name
     */
    getElementTagName(elementId: string): string;

    /**
     * [webdriver]
     * The Get Element Rect command returns the dimensions and coordinates of the given web element.
     * https://w3c.github.io/webdriver/#dfn-get-element-rect
     */
    getElementRect(elementId: string): RectReturn;

    /**
     * [webdriver]
     * Is Element Enabled determines if the referenced element is enabled or not. This operation only makes sense on form controls.
     * https://w3c.github.io/webdriver/#dfn-is-element-enabled
     */
    isElementEnabled(elementId: string): boolean;

    /**
     * [webdriver]
     * The Element Click command scrolls into view the element if it is not already pointer-interactable, and clicks its in-view center point. If the element's center point is obscured by another element, an element click intercepted error is returned. If the element is outside the viewport, an element not interactable error is returned.
     * https://w3c.github.io/webdriver/#dfn-element-click
     */
    elementClick(elementId: string): void;

    /**
     * [webdriver]
     * The Element Clear command scrolls into view an editable or resettable element and then attempts to clear its selected files or text content.
     * https://w3c.github.io/webdriver/#dfn-element-clear
     */
    elementClear(elementId: string): void;

    /**
     * [webdriver]
     * The Element Send Keys command scrolls into view the form control element and then sends the provided keys to the element. In case the element is not keyboard-interactable, an element not interactable error is returned.<br><br>The key input state used for input may be cleared mid-way through "typing" by sending the null key, which is U+E000 (NULL).
     * https://w3c.github.io/webdriver/#dfn-element-send-keys
     */
    elementSendKeys(elementId: string, text: string): void;

    /**
     * [webdriver]
     * The Get Page Source command returns a string serialization of the DOM of the current browsing context active document.
     * https://w3c.github.io/webdriver/#dfn-get-page-source
     */
    getPageSource(): string;

    /**
     * [webdriver]
     * The Execute Script command executes a JavaScript function in the context of the current browsing context and returns the return value of the function.
     * https://w3c.github.io/webdriver/#dfn-execute-script
     */
    executeScript(script: string, args?: (string|object|number|boolean|undefined)[]): any;

    /**
     * [webdriver]
     * The Execute Async Script command causes JavaScript to execute as an anonymous function. Unlike the Execute Script command, the result of the function is ignored. Instead an additional argument is provided as the final argument to the function. This is a function that, when called, returns its first argument as the response.
     * https://w3c.github.io/webdriver/#dfn-execute-async-script
     */
    executeAsyncScript(script: string, args: (string|object|number|boolean|undefined)[]): any;

    /**
     * [webdriver]
     * The Get All Cookies command returns all cookies associated with the address of the current browsing context’s active document.
     * https://w3c.github.io/webdriver/#dfn-get-all-cookies
     */
    getAllCookies(): object[];

    /**
     * [webdriver]
     * The Add Cookie command adds a single cookie to the cookie store associated with the active document's address.
     * https://w3c.github.io/webdriver/#dfn-adding-a-cookie
     */
    addCookie(cookie: object): void;

    /**
     * [webdriver]
     * The Delete All Cookies command allows deletion of all cookies associated with the active document's address.
     * https://w3c.github.io/webdriver/#dfn-delete-all-cookies
     */
    deleteAllCookies(): void;

    /**
     * [webdriver]
     * The Get Named Cookie command returns the cookie with the requested name from the associated cookies in the cookie store of the current browsing context's active document. If no cookie is found, a no such cookie error is returned.
     * https://w3c.github.io/webdriver/#dfn-get-named-cookie
     */
    getNamedCookie(name: string): WebDriver.Cookie;

    /**
     * [webdriver]
     * The Delete Cookie command allows you to delete either a single cookie by parameter name, or all the cookies associated with the active document's address if name is undefined.
     * https://w3c.github.io/webdriver/#dfn-delete-cookie
     */
    deleteCookie(name: string): void;

    /**
     * [webdriver]
     * The Perform Actions command is used to execute complex user actions. See [spec](https://github.com/jlipps/simple-wd-spec#perform-actions) for more details.
     * https://w3c.github.io/webdriver/#dfn-perform-actions
     */
    performActions(actions: object[]): void;

    /**
     * [webdriver]
     * The Release Actions command is used to release all the keys and pointer buttons that are currently depressed. This causes events to be fired as if the state was released by an explicit series of actions. It also clears all the internal state of the virtual devices.
     * https://w3c.github.io/webdriver/#dfn-release-actions
     */
    releaseActions(): void;

    /**
     * [webdriver]
     * The Dismiss Alert command dismisses a simple dialog if present, otherwise error. A request to dismiss an alert user prompt, which may not necessarily have a dismiss button, has the same effect as accepting it.
     * https://w3c.github.io/webdriver/#dfn-dismiss-alert
     */
    dismissAlert(): void;

    /**
     * [webdriver]
     * The Accept Alert command accepts a simple dialog if present, otherwise error.
     * https://w3c.github.io/webdriver/#dfn-accept-alert
     */
    acceptAlert(): void;

    /**
     * [webdriver]
     * The Get Alert Text command returns the message of the current user prompt. If there is no current user prompt, it returns an error.
     * https://w3c.github.io/webdriver/#dfn-get-alert-text
     */
    getAlertText(): string;

    /**
     * [webdriver]
     * The Send Alert Text command sets the text field of a window.prompt user prompt to the given value.
     * https://w3c.github.io/webdriver/#dfn-send-alert-text
     */
    sendAlertText(text: string): void;

    /**
     * [webdriver]
     * The Take Screenshot command takes a screenshot of the top-level browsing context's viewport.
     * https://w3c.github.io/webdriver/#dfn-take-screenshot
     */
    takeScreenshot(): string;

    /**
     * [webdriver]
     * The Take Element Screenshot command takes a screenshot of the visible region encompassed by the bounding rectangle of an element.
     * https://w3c.github.io/webdriver/#dfn-take-element-screenshot
     */
    takeElementScreenshot(elementId: string, scroll?: boolean): string;

    /**
     * [webdriver]
     * Get the computed WAI-ARIA role of an element.
     * https://w3c.github.io/webdriver/#get-computed-role
     */
    getElementComputedRole(elementId: string): string;

    /**
     * [webdriver]
     * Get the accessible name of the element.
     * https://w3c.github.io/webdriver/#get-computed-label
     */
    getElementComputedLabel(elementId: string): string;
}
// appium types
interface Client extends BaseClient {

    /**
     * [appium]
     * Perform a shake action on the device.
     * http://appium.io/docs/en/commands/device/interactions/shake/
     */
    shake(): void;

    /**
     * [appium]
     * Lock the device.
     * http://appium.io/docs/en/commands/device/interactions/lock/
     */
    lock(seconds?: number): void;

    /**
     * [appium]
     * Unlock the device.
     * http://appium.io/docs/en/commands/device/interactions/unlock/
     */
    unlock(): void;

    /**
     * [appium]
     * Check whether the device is locked or not.
     * http://appium.io/docs/en/commands/device/interactions/is-locked/
     */
    isLocked(): boolean;

    /**
     * [appium]
     * Start recording the screen.
     * http://appium.io/docs/en/commands/device/recording-screen/start-recording-screen/
     */
    startRecordingScreen(options?: object): void;

    /**
     * [appium]
     * Stop recording screen
     * http://appium.io/docs/en/commands/device/recording-screen/stop-recording-screen/
     */
    stopRecordingScreen(remotePath?: string, username?: string, password?: string, method?: string): string;

    /**
     * [appium]
     * Returns the information types of the system state which is supported to read as like cpu, memory, network traffic, and battery.
     * http://appium.io/docs/en/commands/device/performance-data/performance-data-types/
     */
    getPerformanceDataTypes(): string[];

    /**
     * [appium]
     * Returns the information of the system state which is supported to read as like cpu, memory, network traffic, and battery.
     * http://appium.io/docs/en/commands/device/performance-data/get-performance-data/
     */
    getPerformanceData(packageName: string, dataType: string, dataReadTimeout?: number): string[];

    /**
     * [appium]
     * Press a particular key on the device.
     * http://appium.io/docs/en/commands/device/keys/press-keycode/
     */
    pressKeyCode(keycode: number, metastate?: number, flags?: number): void;

    /**
     * [appium]
     * Press and hold a particular key code on the device.
     * http://appium.io/docs/en/commands/device/keys/long-press-keycode/
     */
    longPressKeyCode(keycode: number, metastate?: number, flags?: number): void;

    /**
     * [appium]
     * Send a key code to the device.
     * https://github.com/appium/appium-base-driver/blob/master/docs/mjsonwp/protocol-methods.md#appium-extension-endpoints
     */
    sendKeyEvent(keycode: string, metastate?: string): void;

    /**
     * [appium]
     * Rotate the device in three dimensions.
     * http://appium.io/docs/en/commands/device/interactions/rotate/
     */
    rotateDevice(x: number, y: number, radius: number, rotation: number, touchCount: number, duration: number, element?: string): void;

    /**
     * [appium]
     * Get the name of the current Android activity.
     * http://appium.io/docs/en/commands/device/activity/current-activity/
     */
    getCurrentActivity(): string;

    /**
     * [appium]
     * Get the name of the current Android package.
     * http://appium.io/docs/en/commands/device/activity/current-package/
     */
    getCurrentPackage(): string;

    /**
     * [appium]
     * Install the given app onto the device.
     * http://appium.io/docs/en/commands/device/app/install-app/
     */
    installApp(appPath: string): void;

    /**
     * [appium]
     * Activate the given app onto the device
     * http://appium.io/docs/en/commands/device/app/activate-app/
     */
    activateApp(appId?: string, bundleId?: string): void;

    /**
     * [appium]
     * Remove an app from the device.
     * http://appium.io/docs/en/commands/device/app/remove-app/
     */
    removeApp(appId?: string, bundleId?: string): void;

    /**
     * [appium]
     * Terminate the given app on the device
     * http://appium.io/docs/en/commands/device/app/terminate-app/
     */
    terminateApp(appId?: string, bundleId?: string): void;

    /**
     * [appium]
     * Check whether the specified app is installed on the device.
     * http://appium.io/docs/en/commands/device/app/is-app-installed/
     */
    isAppInstalled(appId?: string, bundleId?: string): boolean;

    /**
     * [appium]
     * Get the given app status on the device
     * http://appium.io/docs/en/commands/device/app/app-state/
     */
    queryAppState(appId?: string, bundleId?: string): number;

    /**
     * [appium]
     * Hide soft keyboard.
     * http://appium.io/docs/en/commands/device/keys/hide-keyboard/
     */
    hideKeyboard(strategy?: string, key?: string, keyCode?: string, keyName?: string): void;

    /**
     * [appium]
     * Whether or not the soft keyboard is shown.
     * http://appium.io/docs/en/commands/device/keys/is-keyboard-shown/
     */
    isKeyboardShown(): boolean;

    /**
     * [appium]
     * Place a file onto the device in a particular place.
     * http://appium.io/docs/en/commands/device/files/push-file/
     */
    pushFile(path: string, data: string): void;

    /**
     * [appium]
     * Retrieve a file from the device's file system.
     * http://appium.io/docs/en/commands/device/files/pull-file/
     */
    pullFile(path: string): void;

    /**
     * [appium]
     * Retrieve a folder from the device's file system.
     * http://appium.io/docs/en/commands/device/files/pull-folder/
     */
    pullFolder(path: string): void;

    /**
     * [appium]
     * Toggle airplane mode on device.
     * http://appium.io/docs/en/commands/device/network/toggle-airplane-mode/
     */
    toggleAirplaneMode(): void;

    /**
     * [appium]
     * Switch the state of data service.
     * http://appium.io/docs/en/commands/device/network/toggle-data/
     */
    toggleData(): void;

    /**
     * [appium]
     * Switch the state of the wifi service.
     * http://appium.io/docs/en/commands/device/network/toggle-wifi/
     */
    toggleWiFi(): void;

    /**
     * [appium]
     * Switch the state of the location service.
     * http://appium.io/docs/en/commands/device/network/toggle-location-services/
     */
    toggleLocationServices(): void;

    /**
     * [appium]
     * Set network speed (Emulator only)
     * http://appium.io/docs/en/commands/device/network/network-speed/
     */
    toggleNetworkSpeed(): void;

    /**
     * [appium]
     * Open Android notifications (Emulator only).
     * http://appium.io/docs/en/commands/device/system/open-notifications/
     */
    openNotifications(): void;

    /**
     * [appium]
     * Start an Android activity by providing package name and activity name.
     * http://appium.io/docs/en/commands/device/activity/start-activity/
     */
    startActivity(appPackage: string, appActivity: string, appWaitPackage?: string, appWaitActivity?: string, intentAction?: string, intentCategory?: string, intentFlags?: string, optionalIntentArguments?: string, dontStopAppOnReset?: string): void;

    /**
     * [appium]
     * Retrieve visibility and bounds information of the status and navigation bars.
     * http://appium.io/docs/en/commands/device/system/system-bars/
     */
    getSystemBars(): object[];

    /**
     * [appium]
     * Get the time on the device.
     * http://appium.io/docs/en/commands/device/system/system-time/
     */
    getDeviceTime(): string;

    /**
     * [appium]
     * Get display density from device.
     * https://github.com/appium/appium-base-driver/blob/master/docs/mjsonwp/protocol-methods.md#appium-extension-endpoints
     */
    getDisplayDensity(): any;

    /**
     * [appium]
     * Simulate a [touch id](https://support.apple.com/en-ca/ht201371) event (iOS Simulator only). To enable this feature, the `allowTouchIdEnroll` desired capability must be set to true and the Simulator must be [enrolled](https://support.apple.com/en-ca/ht201371). When you set allowTouchIdEnroll to true, it will set the Simulator to be enrolled by default. The enrollment state can be [toggled](http://appium.io/docs/en/commands/device/simulator/toggle-touch-id-enrollment/index.html). This call will only work if Appium process or its parent application (e.g. Terminal.app or Appium.app) has access to Mac OS accessibility in System Preferences > Security & Privacy > Privacy > Accessibility list.
     * http://appium.io/docs/en/commands/device/simulator/touch-id/
     */
    touchId(match: boolean): void;

    /**
     * [appium]
     * Toggle the simulator being [enrolled](https://support.apple.com/en-ca/ht201371) to accept touchId (iOS Simulator only). To enable this feature, the `allowTouchIdEnroll` desired capability must be set to true. When `allowTouchIdEnroll` is set to true the Simulator will be enrolled by default, and the 'Toggle Touch ID Enrollment' changes the enrollment state. This call will only work if the Appium process or its parent application (e.g., Terminal.app or Appium.app) has access to Mac OS accessibility in System Preferences > Security & Privacy > Privacy > Accessibility list.
     * http://appium.io/docs/en/commands/device/simulator/toggle-touch-id-enrollment/
     */
    toggleEnrollTouchId(enabled?: boolean): void;

    /**
     * [appium]
     * Launch an app on device. iOS tests with XCUITest can also use the `mobile: launchApp` method. See detailed [documentation](http://appium.io/docs/en/writing-running-appium/ios/ios-xctest-mobile-apps-management/index.html#mobile-launchapp).
     * http://appium.io/docs/en/commands/device/app/launch-app/
     */
    launchApp(): void;

    /**
     * [appium]
     * Close an app on device.
     * http://appium.io/docs/en/commands/device/app/close-app/
     */
    closeApp(): void;

    /**
     * [appium]
     * Reset the currently running app for this session.
     * http://appium.io/docs/en/commands/device/app/reset-app/
     */
    reset(): void;

    /**
     * [appium]
     * Send the currently running app for this session to the background. iOS tests with XCUITest can also use the `mobile: terminateApp` method to terminate the current app (see detailed [documentation](http://appium.io/docs/en/writing-running-appium/ios/ios-xctest-mobile-apps-management/index.html#mobile-terminateapp)), and the `mobile: activateApp` to activate an existing application on the device under test and moves it to the foreground (see detailed [documentation](http://appium.io/docs/en/writing-running-appium/ios/ios-xctest-mobile-apps-management/index.html#mobile-activateapp)).
     * http://appium.io/docs/en/commands/device/app/background-app/
     */
    background(seconds: (number|null)): void;

    /**
     * [appium]
     * Get test coverage data.
     * http://appium.io/docs/en/commands/device/app/end-test-coverage/
     */
    endCoverage(intent: string, path: string): void;

    /**
     * [appium]
     * Get app strings.
     * http://appium.io/docs/en/commands/device/app/get-app-strings/
     */
    getStrings(language?: string, stringFile?: string): StringsReturn;

    /**
     * [appium]
     * 
     * https://github.com/appium/appium-base-driver/blob/master/docs/mjsonwp/protocol-methods.md#appium-extension-endpoints
     */
    setValueImmediate(elementId: string, value: string): void;

    /**
     * [appium]
     * Replace the value to element directly.
     * https://github.com/appium/appium-base-driver/blob/master/docs/mjsonwp/protocol-methods.md#appium-extension-endpoints
     */
    replaceValue(elementId: string, value: string): void;

    /**
     * [appium]
     * Retrieve the current settings on the device.
     * http://appium.io/docs/en/commands/session/settings/get-settings/
     */
    getSettings(): SettingsReturn;

    /**
     * [appium]
     * Update the current setting on the device.
     * http://appium.io/docs/en/commands/session/settings/update-settings/
     */
    updateSettings(settings: object): void;

    /**
     * [appium]
     * Callback url for asynchronous execution of JavaScript.
     * https://github.com/appium/appium-base-driver/blob/master/docs/mjsonwp/protocol-methods.md#appium-extension-endpoints
     */
    receiveAsyncResponse(response: object): void;

    /**
     * [appium]
     * Make GSM call (Emulator only).
     * http://appium.io/docs/en/commands/device/network/gsm-call/
     */
    gsmCall(phoneNumber: string, action: string): void;

    /**
     * [appium]
     * Set GSM signal strength (Emulator only).
     * http://appium.io/docs/en/commands/device/network/gsm-signal/
     */
    gsmSignal(signalStrength: string, signalStrengh?: string): void;

    /**
     * [appium]
     * Set the battery percentage (Emulator only).
     * http://appium.io/docs/en/commands/device/emulator/power_capacity/
     */
    powerCapacity(percent: number): void;

    /**
     * [appium]
     * Set the state of the battery charger to connected or not (Emulator only).
     * http://appium.io/docs/en/commands/device/emulator/power_ac/
     */
    powerAC(state: string): void;

    /**
     * [appium]
     * Set GSM voice state (Emulator only).
     * http://appium.io/docs/en/commands/device/network/gsm-voice/
     */
    gsmVoice(state: string): void;

    /**
     * [appium]
     * Simulate an SMS message (Emulator only).
     * http://appium.io/docs/en/commands/device/network/send-sms/
     */
    sendSms(phoneNumber: string, message: string): void;

    /**
     * [appium]
     * Authenticate users by using their finger print scans on supported emulators.
     * http://appium.io/docs/en/commands/device/authentication/finger-print/
     */
    fingerPrint(fingerprintId: number): void;

    /**
     * [appium]
     * Set the content of the system clipboard
     * http://appium.io/docs/en/commands/device/clipboard/set-clipboard/
     */
    setClipboard(content: string, contentType?: string, label?: string): string;

    /**
     * [appium]
     * Get the content of the system clipboard
     * http://appium.io/docs/en/commands/device/clipboard/get-clipboard/
     */
    getClipboard(contentType?: string): string;

    /**
     * [appium]
     * This functionality is only available from within a native context. 'Touch Perform' works similarly to the other singular touch interactions, except that this allows you to chain together more than one touch action as one command. This is useful because Appium commands are sent over the network and there's latency between commands. This latency can make certain touch interactions impossible because some interactions need to be performed in one sequence. Vertical, for example, requires pressing down, moving to a different y coordinate, and then releasing. For it to work, there can't be a delay between the interactions.
     * http://appium.io/docs/en/commands/interactions/touch/touch-perform/
     */
    touchPerform(actions: object[]): void;

    /**
     * [appium]
     * This functionality is only available from within a native context. Perform a multi touch action sequence.
     * http://appium.io/docs/en/commands/interactions/touch/multi-touch-perform/
     */
    multiTouchPerform(actions: object[]): void;

    /**
     * [appium]
     * This command allows you to define a webdriverio script in a string and send it to the Appium server to be executed locally to the server itself, thus reducing latency that might otherwise occur along with each command.
     * https://github.com/appium/appium/blob/master/docs/en/commands/session/execute-driver.md
     */
    driverScript(script: string, type?: string, timeout?: number): ProtocolCommandResponse;

    /**
     * [appium]
     * Get events stored in appium server.
     * https://github.com/appium/appium/blob/master/docs/en/commands/session/events/get-events.md
     */
    getEvents(type: string[]): ProtocolCommandResponse;

    /**
     * [appium]
     * Store a custom event.
     * https://github.com/appium/appium/blob/master/docs/en/commands/session/events/log-event.md
     */
    logEvent(vendor: string, event: string): void;

    /**
     * [appium]
     * Performs images comparison using OpenCV framework features. It is expected that both OpenCV framework and opencv4nodejs module are installed on the machine where Appium server is running.
     * http://appium.io/docs/en/writing-running-appium/image-comparison/
     */
    compareImages(mode: string, firstImage: string, secondImage: string, options: object): ProtocolCommandResponse;
}
// jsonwp types
interface Client extends BaseClient {

    /**
     * [jsonwp]
     * Query the server's current status. The server should respond with a general "HTTP 200 OK" response if it is alive and accepting commands. The response body should be a JSON object describing the state of the server. All server implementations should return two basic objects describing the server's current platform and when the server was built. All fields are optional; if omitted, the client should assume the value is unknown. Furthermore, server implementations may include additional fields not listed here.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#status
     */
    status(): StatusReturn;

    /**
     * [jsonwp]
     * Create a new session. The server should attempt to create a session that most closely matches the desired and required capabilities. Required capabilities have higher priority than desired capabilities and must be set for the session to be created.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#session-1
     */
    newSession(desiredCapabilities: object, requiredCapabilities: object): SessionReturn;

    /**
     * [jsonwp]
     * Returns a list of the currently active sessions. Each session will be returned as a list of JSON objects containing `id` and `capabilities`.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessions
     */
    getSessions(): object[];

    /**
     * [jsonwp]
     * Retrieve the capabilities of the specified session.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#get-sessionsessionid
     */
    getSession(): ProtocolCommandResponse;

    /**
     * [jsonwp]
     * Delete the session.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#delete-sessionsessionid
     */
    deleteSession(): void;

    /**
     * [jsonwp]
     * Configure the amount of time that a particular type of operation can execute for before they are aborted and a |Timeout| error is returned to the client.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidtimeouts
     */
    setTimeouts(type: string, ms: number): void;

    /**
     * [jsonwp]
     * Set the amount of time, in milliseconds, that asynchronous scripts executed by `/session/:sessionId/execute_async` are permitted to run before they are aborted and a `Timeout` error is returned to the client.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidtimeoutsasync_script
     */
    setAsyncTimeout(ms: number): void;

    /**
     * [jsonwp]
     * Set the amount of time the driver should wait when searching for elements. When searching for a single element, the driver should poll the page until an element is found or the timeout expires, whichever occurs first. When searching for multiple elements, the driver should poll the page until at least one element is found or the timeout expires, at which point it should return an empty list. If this command is never sent, the driver should default to an implicit wait of 0ms.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidtimeoutsimplicit_wait
     */
    setImplicitTimeout(ms: number): void;

    /**
     * [jsonwp]
     * Retrieve the URL of the current page.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#get-sessionsessionidurl
     */
    getUrl(): string;

    /**
     * [jsonwp]
     * Navigate to a new URL.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#post-sessionsessionidurl
     */
    navigateTo(url: string): void;

    /**
     * [jsonwp]
     * Navigate backwards in the browser history, if possible.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidback
     */
    back(): void;

    /**
     * [jsonwp]
     * Navigate forwards in the browser history, if possible.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidforward
     */
    forward(): void;

    /**
     * [jsonwp]
     * Refresh the current page.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidrefresh
     */
    refresh(): void;

    /**
     * [jsonwp]
     * Get the current page title.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidtitle
     */
    getTitle(): string;

    /**
     * [jsonwp]
     * Retrieve the current window handle.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidwindow_handle
     */
    getWindowHandle(): string;

    /**
     * [jsonwp]
     * Retrieve the list of all window handles available to the session.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidwindow_handles
     */
    getWindowHandles(): string[];

    /**
     * [jsonwp]
     * Close the current window.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#delete-sessionsessionidwindow
     */
    closeWindow(): void;

    /**
     * [jsonwp]
     * Change focus to another window. The window to change focus to may be specified by its server assigned window handle, or by the value of its `name` attribute.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#post-sessionsessionidwindow
     */
    switchToWindow(name: string): void;

    /**
     * [jsonwp]
     * Change focus to another frame on the page. If the frame `id` is `null`, the server should switch to the page's default content.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidframe
     */
    switchToFrame(id: (string|number|object|null)): void;

    /**
     * [jsonwp]
     * Change focus to the parent context. If the current context is the top level browsing context, the context remains unchanged.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidframeparent
     */
    switchToParentFrame(): void;

    /**
     * [jsonwp]
     * Get the position of the current focussed window.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#get-sessionsessionidwindowwindowhandleposition
     */
    getWindowPosition(): ProtocolCommandResponse;

    /**
     * [jsonwp]
     * Change the position of the current focussed window.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#post-sessionsessionidwindowwindowhandleposition
     */
    setWindowPosition(x: number, y: number): ProtocolCommandResponse;

    /**
     * [jsonwp]
     * Get the size of the current focused window.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#get-sessionsessionidwindowwindowhandlesize
     */
    _getWindowSize(): ProtocolCommandResponse;

    /**
     * [jsonwp]
     * Change the size of the current focused window.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#post-sessionsessionidwindowwindowhandlesize
     */
    _setWindowSize(width: number, height: number): void;

    /**
     * [jsonwp]
     * Maximize the current focused window if not already maximized.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidwindowwindowhandlemaximize
     */
    maximizeWindow(): void;

    /**
     * [jsonwp]
     * Search for an element on the page, starting from the document root. The located element will be returned as a WebElement JSON object. The table below lists the locator strategies that each server should support. Each locator must return the first matching element located in the DOM.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelement
     */
    findElement(using: string, value: string): string;

    /**
     * [jsonwp]
     * Search for multiple elements on the page, starting from the document root. The located elements will be returned as a WebElement JSON objects. The table below lists the locator strategies that each server should support. Elements should be returned in the order located in the DOM.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelements
     */
    findElements(using: string, value: string): string[];

    /**
     * [jsonwp]
     * Search for an element on the page, starting from the identified element. The located element will be returned as a WebElement JSON object. The table below lists the locator strategies that each server should support. Each locator must return the first matching element located in the DOM.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidelement
     */
    findElementFromElement(elementId: string, using: string, value: string): string;

    /**
     * [jsonwp]
     * Search for multiple elements on the page, starting from the identified element. The located elements will be returned as a WebElement JSON objects. The table below lists the locator strategies that each server should support. Elements should be returned in the order located in the DOM.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidelements
     */
    findElementsFromElement(elementId: string, using: string, value: string): string[];

    /**
     * [jsonwp]
     * Get the element on the page that currently has focus. The element will be returned as a WebElement JSON object.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementactive
     */
    getActiveElement(): string;

    /**
     * [jsonwp]
     * Determine if an `OPTION` element, or an `INPUT` element of type `checkbox` or `radiobutton` is currently selected.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidselected
     */
    isElementSelected(elementId: string): boolean;

    /**
     * [jsonwp]
     * Determine if an element is currently displayed.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementiddisplayed
     */
    isElementDisplayed(elementId: string): boolean;

    /**
     * [jsonwp]
     * Get the value of an element's attribute.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidattributename
     */
    getElementAttribute(elementId: string, name: string): string|null;

    /**
     * [jsonwp]
     * Query the value of an element's computed CSS property. The CSS property to query should be specified using the CSS property name, __not__ the JavaScript property name (e.g. `background-color` instead of `backgroundColor`).
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidcsspropertyname
     */
    getElementCSSValue(elementId: string, propertyName: string): string;

    /**
     * [jsonwp]
     * Returns the visible text for the element.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidtext
     */
    getElementText(elementId: string): string;

    /**
     * [jsonwp]
     * Query for an element's tag name.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidname
     */
    getElementTagName(elementId: string): string;

    /**
     * [jsonwp]
     * Determine an element's location on the page. The point `(0, 0)` refers to the upper-left corner of the page. The element's coordinates are returned as a JSON object with `x` and `y` properties.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidlocation
     */
    getElementLocation(elementId: string): ProtocolCommandResponse;

    /**
     * [jsonwp]
     * Determine an element's location on the screen once it has been scrolled into view.<br><br>__Note:__ This is considered an internal command and should only be used to determine an element's location for correctly generating native events.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidlocation_in_view
     */
    getElementLocationInView(elementId: string): ProtocolCommandResponse;

    /**
     * [jsonwp]
     * Determine an element's size in pixels. The size will be returned as a JSON object with `width` and `height` properties.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidsize
     */
    getElementSize(elementId: string): ProtocolCommandResponse;

    /**
     * [jsonwp]
     * Determine if an element is currently enabled.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidenabled
     */
    isElementEnabled(elementId: string): boolean;

    /**
     * [jsonwp]
     * Click any mouse button (at the coordinates set by the last moveto command). Note that calling this command after calling buttondown and before calling button up (or any out-of-order interactions sequence) will yield undefined behaviour).
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidclick
     */
    elementClick(elementId: string): void;

    /**
     * [jsonwp]
     * Compare elements with each other.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidequalsother
     */
    elementEquals(elementId: string, otherElementId: string): boolean;

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidsubmit
     */
    elementSubmit(elementId: string): void;

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidclear
     */
    elementClear(elementId: string): void;

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidvalue
     */
    elementSendKeys(elementId: string, value: string[]): void;

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidkeys
     */
    sendKeys(value: string[]): void;

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidsource
     */
    getPageSource(): string;

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidexecute
     */
    executeScript(script: string, args?: (string|object|number|boolean|undefined)[]): any;

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidexecute_async
     */
    executeAsyncScript(script: string, args: (string|object|number|boolean|undefined)[]): any;

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#get-sessionsessionidcookie
     */
    getAllCookies(): object[];

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#post-sessionsessionidcookie
     */
    addCookie(cookie: object): void;

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#delete-sessionsessionidcookie
     */
    deleteAllCookies(): void;

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#delete-sessionsessionidcookiename
     */
    deleteCookie(name: string): void;

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessioniddismiss_alert
     */
    dismissAlert(): void;

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidaccept_alert
     */
    acceptAlert(): void;

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#get-sessionsessionidalert_text
     */
    getAlertText(): string;

    /**
     * [jsonwp]
     * 
     * https://w3c.github.io/webdriver/webdriver-spec.html#dfn-send-alert-text
     */
    sendAlertText(text: string): void;

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidscreenshot
     */
    takeScreenshot(): string;

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidimeavailable_engines
     */
    getAvailableEngines(): string[];

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidimeactive_engine
     */
    getActiveEngine(): string;

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidimeactivated
     */
    isIMEActivated(): boolean;

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidimedeactivate
     */
    deactivateIME(): void;

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidimeactivate
     */
    activateIME(engine: string): void;

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#get-sessionsessionidorientation
     */
    getOrientation(): string;

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#post-sessionsessionidorientation
     */
    setOrientation(orientation: string): void;

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidmoveto
     */
    moveToElement(element?: (string|null), xoffset?: number, yoffset?: number): void;

    /**
     * [jsonwp]
     * Click and hold the left mouse button (at the coordinates set by the last moveto command). Note that the next mouse-related command that should follow is buttonup . Any other mouse command (such as click or another call to buttondown) will yield undefined behaviour.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidbuttondown
     */
    buttonDown(button?: number): void;

    /**
     * [jsonwp]
     * Releases the mouse button previously held (where the mouse is currently at). Must be called once for every buttondown command issued. See the note in click and buttondown about implications of out-of-order commands.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidbuttonup
     */
    buttonUp(button?: number): void;

    /**
     * [jsonwp]
     * Clicks at the current mouse coordinates (set by moveto).
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidclick
     */
    positionClick(button?: number): void;

    /**
     * [jsonwp]
     * Double-clicks at the current mouse coordinates (set by moveto).
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessioniddoubleclick
     */
    positionDoubleClick(): void;

    /**
     * [jsonwp]
     * Single tap on the touch enabled device.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidtouchclick
     */
    touchClick(element: string): void;

    /**
     * [jsonwp]
     * Finger down on the screen.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidtouchdown
     */
    touchDown(x: number, y: number): void;

    /**
     * [jsonwp]
     * Finger up on the screen.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidtouchup
     */
    touchUp(x: number, y: number): void;

    /**
     * [jsonwp]
     * Finger move on the screen.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidtouchmove
     */
    touchMove(x: number, y: number): void;

    /**
     * [jsonwp]
     * Finger move on the screen.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidtouchscroll
     */
    touchScroll(xoffset: number, yoffset: number, element?: string): void;

    /**
     * [jsonwp]
     * Double tap on the touch screen using finger motion events.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidtouchdoubleclick
     */
    touchDoubleClick(element: string): void;

    /**
     * [jsonwp]
     * Long press on the touch screen using finger motion events.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidtouchlongclick
     */
    touchLongClick(element: string): void;

    /**
     * [jsonwp]
     * Flick on the touch screen using finger motion events. This flickcommand starts at a particulat screen location.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidtouchflick
     */
    touchFlick(xoffset?: number, yoffset?: number, element?: string, speed?: number, xspeed?: number, yspeed?: number): void;

    /**
     * [jsonwp]
     * Get the current geo location.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#get-sessionsessionidlocation
     */
    getGeoLocation(): ProtocolCommandResponse;

    /**
     * [jsonwp]
     * Set the current geo location.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#post-sessionsessionidlocation
     */
    setGeoLocation(location: object): void;

    /**
     * [jsonwp]
     * Get all keys of the storage.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#get-sessionsessionidlocal_storage
     */
    getLocalStorage(): string[];

    /**
     * [jsonwp]
     * Set the storage item for the given key.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#post-sessionsessionidlocal_storage
     */
    setLocalStorage(key: string, value: string): void;

    /**
     * [jsonwp]
     * Clear the storage.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#get-sessionsessionidlocal_storage
     */
    clearLocalStorage(): void;

    /**
     * [jsonwp]
     * Get the storage item for the given key.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#get-sessionsessionidlocal_storagekeykey
     */
    getLocalStorageItem(key: string): string;

    /**
     * [jsonwp]
     * 
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#delete-sessionsessionidlocal_storagekeykey
     */
    deleteLocalStorageItem(key: string): void;

    /**
     * [jsonwp]
     * Get the number of items in the storage.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidlocal_storagesize
     */
    getLocalStorageSize(): number;

    /**
     * [jsonwp]
     * Get all keys of the storage.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#get-sessionsessionidsession_storage
     */
    getSessionStorage(): string[];

    /**
     * [jsonwp]
     * Set the storage item for the given key.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#post-sessionsessionidsession_storage
     */
    setSessionStorage(key: string, value: string): void;

    /**
     * [jsonwp]
     * Clear the storage.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#delete-sessionsessionidsession_storage
     */
    clearSessionStorage(): void;

    /**
     * [jsonwp]
     * Get the storage item for the given key.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#get-sessionsessionidsession_storagekeykey
     */
    getSessionStorageItem(key: string): string;

    /**
     * [jsonwp]
     * Remove the storage item for the given key.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#delete-sessionsessionidsession_storagekeykey
     */
    deleteSessionStorageItem(key: string): void;

    /**
     * [jsonwp]
     * Get the number of items in the storage.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidsession_storagesize
     */
    getSessionStorageSize(): number;

    /**
     * [jsonwp]
     * Get the log for a given log type. Log buffer is reset after each request.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidlog
     */
    getLogs(type: string): object[];

    /**
     * [jsonwp]
     * Get available log types.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidlogtypes
     */
    getLogTypes(): string[];

    /**
     * [jsonwp]
     * Get the status of the html5 application cache.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidapplication_cachestatus
     */
    getApplicationCacheStatus(): number;
}
// mjsonwp types
interface Client extends BaseClient {

    /**
     * [mjsonwp]
     * 
     * https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md#webviews-and-other-contexts
     */
    getContext(): string|null;

    /**
     * [mjsonwp]
     * 
     * https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md#webviews-and-other-contexts
     */
    switchContext(name: string): void;

    /**
     * [mjsonwp]
     * 
     * https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md#webviews-and-other-contexts
     */
    getContexts(): string[];

    /**
     * [mjsonwp]
     * 
     * https://github.com/appium/appium-base-driver/blob/master/docs/mjsonwp/protocol-methods.md#mobile-json-wire-protocol-endpoints
     */
    getPageIndex(): string;

    /**
     * [mjsonwp]
     * 
     * https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md#device-modes
     */
    getNetworkConnection(): number;

    /**
     * [mjsonwp]
     * 
     * https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md#device-modes
     */
    setNetworkConnection(type: number): void;

    /**
     * [mjsonwp]
     * 
     * https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md#touch-gestures
     */
    touchPerform(actions: object[]): void;

    /**
     * [mjsonwp]
     * 
     * https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md#touch-gestures
     */
    multiTouchPerform(actions: object[], elementId: object[]): void;

    /**
     * [mjsonwp]
     * 
     * https://github.com/appium/appium-base-driver/blob/master/docs/mjsonwp/protocol-methods.md#mobile-json-wire-protocol-endpoints
     */
    receiveAsyncResponse(status: string, value: string): void;
}
// chromium types
interface Client extends BaseClient {

    /**
     * [chromium]
     * Whether a simple dialog is currently open.
     * https://github.com/bayandin/chromedriver/blob/v2.45/alert_commands.cc#L42-L49
     */
    isAlertOpen(): boolean;

    /**
     * [chromium]
     * Whether it should automatically raises errors on browser logs.
     * https://codereview.chromium.org/101203012
     */
    isAutoReporting(): boolean;

    /**
     * [chromium]
     * Toggle whether to return response with unknown error with first browser error (e.g. failed to load resource due to 403/404 response) for all subsequent commands (once enabled).
     * https://codereview.chromium.org/101203012
     */
    setAutoReporting(enabled: boolean): object|null;

    /**
     * [chromium]
     * Determines load status for active window handle.
     * https://github.com/bayandin/chromedriver/blob/v2.45/session_commands.cc#L783-L802
     */
    isLoading(): boolean;

    /**
     * [chromium]
     * Takes a heap snapshot of the current execution context.
     * https://github.com/bayandin/chromedriver/blob/v2.45/chrome/web_view.h#L198-L202
     */
    takeHeapSnapshot(): ProtocolCommandResponse;

    /**
     * [chromium]
     * Get the connection type for network emulation. This command is only applicable when remote end replies with `networkConnectionEnabled` capability set to `true`.
     * https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md#device-modes
     */
    getNetworkConnection(): number;

    /**
     * [chromium]
     * Change connection type for network connection. This command is only applicable when remote end replies with `networkConnectionEnabled` capability set to `true`.
     * https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md#device-modes
     */
    setNetworkConnection(parameters: object): number;

    /**
     * [chromium]
     * Get current network conditions used for emulation.
     * https://github.com/bayandin/chromedriver/blob/v2.45/session_commands.cc#L839-L859
     */
    getNetworkConditions(): ProtocolCommandResponse;

    /**
     * [chromium]
     * Set network conditions used for emulation by throttling connection.
     * https://github.com/bayandin/chromedriver/blob/v2.45/window_commands.cc#L1663-L1722
     */
    setNetworkConditions(network_conditions: object, network_name?: string): void;

    /**
     * [chromium]
     * Disable any network throttling which might have been set. Equivalent of setting the `No throttling` preset.
     * https://github.com/bayandin/chromedriver/blob/v2.45/window_commands.cc#L1724-L1745
     */
    deleteNetworkConditions(): void;

    /**
     * [chromium]
     * Send a command to the DevTools debugger.<br>For a list of available commands and their parameters refer to the [Chrome DevTools Protocol Viewer](https://chromedevtools.github.io/devtools-protocol/).
     * https://github.com/bayandin/chromedriver/blob/v2.45/window_commands.cc#L1290-L1304
     */
    sendCommand(cmd: string, params: object): void;

    /**
     * [chromium]
     * Send a command to the DevTools debugger and wait for the result.<br>For a list of available commands and their parameters refer to the [Chrome DevTools Protocol Viewer](https://chromedevtools.github.io/devtools-protocol/).
     * https://github.com/bayandin/chromedriver/blob/v2.45/window_commands.cc#L1306-L1320
     */
    sendCommandAndGetResult(cmd: string, params: object): any;

    /**
     * [chromium]
     * Generates a report for testing. Extension for [Reporting API](https://developers.google.com/web/updates/2018/09/reportingapi).
     * https://w3c.github.io/reporting/#generate-test-report-command
     */
    generateTestReport(message: string, group: string): void;

    /**
     * [chromium]
     * Upload a file to remote machine on which the browser is running.
     * https://github.com/bayandin/chromedriver/blob/v2.45/session_commands.cc#L1037-L1065
     */
    file(file: string): string;

    /**
     * [chromium]
     * Launches a Chrome app by specified id.
     * https://github.com/bayandin/chromedriver/blob/v2.45/session_commands.cc#L521-L539
     */
    launchChromeApp(id: string): void;

    /**
     * [chromium]
     * Retrieves the value of a given form control element.
     * https://github.com/bayandin/chromedriver/blob/v2.45/element_commands.cc#L431-L443
     */
    getElementValue(elementId: string): string|null;

    /**
     * [chromium]
     * Enable hover state for an element, which is reset upon next interaction.
     * https://github.com/bayandin/chromedriver/blob/v2.45/element_commands.cc#L126-L146
     */
    elementHover(elementId: string): void;

    /**
     * [chromium]
     * Trigger a pinch zoom effect.
     * https://github.com/bayandin/chromedriver/blob/v2.45/window_commands.cc#L813-L827
     */
    touchPinch(x: number, y: number, scale: number): void;

    /**
     * [chromium]
     * Freeze the current page. Extension for [Page Lifecycle API](https://developers.google.com/web/updates/2018/07/page-lifecycle-api).
     * https://github.com/bayandin/chromedriver/blob/v2.45/window_commands.cc#L625-L633
     */
    freeze(): void;

    /**
     * [chromium]
     * Resume the current page. Extension for [Page Lifecycle API](https://developers.google.com/web/updates/2018/07/page-lifecycle-api).
     * https://github.com/bayandin/chromedriver/blob/v2.45/window_commands.cc#L635-L645
     */
    resume(): void;

    /**
     * [chromium]
     * Shutdown ChromeDriver process and consequently terminating all active sessions.
     * https://github.com/bayandin/chromedriver/blob/v2.45/session_commands.cc#L489-L498
     */
    shutdown(): void;

    /**
     * [chromium]
     * The Take Element Screenshot command takes a screenshot of the visible region encompassed by the bounding rectangle of an element.
     * https://w3c.github.io/webdriver/#dfn-take-element-screenshot
     */
    takeElementScreenshot(elementId: string, scroll?: boolean): string;

    /**
     * [chromium]
     * Get available log types.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidlogtypes
     */
    getLogTypes(): string[];

    /**
     * [chromium]
     * Get the log for a given log type. Log buffer is reset after each request.
     * https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidlog
     */
    getLogs(type: string): object[];
}
// saucelabs types
interface Client extends BaseClient {

    /**
     * [saucelabs]
     * Get webpage specific log information based on the last page load.
     * https://wiki.saucelabs.com/display/DOCS/Custom+Sauce+Labs+WebDriver+Extensions+for+Network+and+Log+Commands#CustomSauceLabsWebDriverExtensionsforNetworkandLogCommands-ExtendedDebuggingTools
     */
    getPageLogs(type: string): ProtocolCommandResponse;

    /**
     * [saucelabs]
     * With network conditioning you can test your site on a variety of network connections, including Edge, 3G, and even offline. You can throttle the data throughput, including the maximum download and upload throughput, and use latency manipulation to enforce a minimum delay in connection round-trip time (RTT).
     * https://wiki.saucelabs.com/display/DOCS/Custom+Sauce+Labs+WebDriver+Extensions+for+Network+and+Log+Commands#CustomSauceLabsWebDriverExtensionsforNetworkandLogCommands-ThrottleNetworkCapabilities
     */
    throttleNetwork(condition: (string|object)): void;

    /**
     * [saucelabs]
     * You can throttle the CPU in DevTools to understand how your page performs under that constraint.
     * https://wiki.saucelabs.com/display/DOCS/Custom+Sauce+Labs+WebDriver+Extensions+for+Network+and+Log+Commands#CustomSauceLabsWebDriverExtensionsforNetworkandLogCommands-ThrottleCPUCapabilities
     */
    throttleCPU(rate: number): void;

    /**
     * [saucelabs]
     * Allows modifying any request made by the browser. You can blacklist, modify, or redirect these as required for your tests.
     * https://wiki.saucelabs.com/display/DOCS/Custom+Sauce+Labs+WebDriver+Extensions+for+Network+and+Log+Commands#CustomSauceLabsWebDriverExtensionsforNetworkandLogCommands-InterceptNetworkRequests
     */
    interceptRequest(rule: object): void;

    /**
     * [saucelabs]
     * Assert against the performance baseline of your app.
     * https://wiki.saucelabs.com/display/DOCS/Custom+Sauce+Labs+WebDriver+Extensions+for+Network+and+Log+Commands
     */
    assertPerformance(name: string, metrics?: string[]): ProtocolCommandResponse;

    /**
     * [saucelabs]
     * Perform a scroll test that evaluates the jankiness of the application.
     * https://wiki.saucelabs.com/display/DOCS/Custom+Sauce+Labs+WebDriver+Extensions+for+Network+and+Log+Commands
     */
    jankinessCheck(): ProtocolCommandResponse;

    /**
     * [saucelabs]
     * Mocks a network resource.
     * https://wiki.saucelabs.com/display/DOCS/Custom+Sauce+Labs+WebDriver+Extensions+for+Network+and+Log+Commands
     */
    mockRequest(url: string, filterOptions?: object): ProtocolCommandResponse;

    /**
     * [saucelabs]
     * Receive request information about requests that match the mocked resource.
     * https://wiki.saucelabs.com/display/DOCS/Custom+Sauce+Labs+WebDriver+Extensions+for+Network+and+Log+Commands
     */
    getMockCalls(mockId: string): ProtocolCommandResponse;

    /**
     * [saucelabs]
     * Clear list of mock calls.
     * https://wiki.saucelabs.com/display/DOCS/Custom+Sauce+Labs+WebDriver+Extensions+for+Network+and+Log+Commands
     */
    clearMockCalls(mockId: string, restore: boolean): void;

    /**
     * [saucelabs]
     * Respond if mock matches a specific resource.
     * https://wiki.saucelabs.com/display/DOCS/Custom+Sauce+Labs+WebDriver+Extensions+for+Network+and+Log+Commands
     */
    respondMock(mockId: string, payload: object): void;
}
// selenium types
interface Client extends BaseClient {

    /**
     * [selenium]
     * Upload a file to remote machine on which the browser is running.
     * https://www.seleniumhq.org/
     */
    file(file: string): string;

    /**
     * [selenium]
     * Receive hub config remotely.
     * https://github.com/nicegraham/selenium-grid2-api#gridapihub
     */
    getHubConfig(): ProtocolCommandResponse;

    /**
     * [selenium]
     * Get the details of the Selenium Grid node running a session.
     * https://github.com/nicegraham/selenium-grid2-api#gridapitestsession
     */
    gridTestSession(session: string): ProtocolCommandResponse;

    /**
     * [selenium]
     * Get proxy details.
     * https://github.com/nicegraham/selenium-grid2-api#gridapiproxy
     */
    gridProxyDetails(id: string): ProtocolCommandResponse;

    /**
     * [selenium]
     * Manage lifecycle of hub node.
     * https://github.com/nicegraham/selenium-grid2-api#lifecycle-manager
     */
    manageSeleniumHubLifecycle(action: string): void;
}

//# sourceMappingURL=types.d.ts.map