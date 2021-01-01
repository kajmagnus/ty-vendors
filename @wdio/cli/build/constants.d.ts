export declare const CLI_EPILOGUE: string;
export declare const EXCLUSIVE_SERVICES: {
    'wdio-chromedriver-service': {
        services: string[];
        message: string;
    };
};
export declare const CONFIG_HELPER_INTRO = "\n=========================\nWDIO Configuration Helper\n=========================\n";
export declare const CONFIG_HELPER_SUCCESS_MESSAGE = "\nConfiguration file was created successfully!\nTo run your tests, execute:\n$ npx wdio run wdio.conf.js\n";
export declare const ANDROID_CONFIG: {
    platformName: string;
    automationName: string;
    deviceName: string;
};
export declare const IOS_CONFIG: {
    platformName: string;
    automationName: string;
    deviceName: string;
};
export declare const COMPILER_OPTION_ANSWERS: readonly ["Babel (https://babeljs.io/)", "TypeScript (https://www.typescriptlang.org/)", "No!"];
export declare const COMPILER_OPTIONS: {
    readonly babel: "Babel (https://babeljs.io/)";
    readonly ts: "TypeScript (https://www.typescriptlang.org/)";
    readonly nil: "No!";
};
export declare const TS_COMPILER_INSTRUCTIONS = "To have TypeScript support please add the following packages to your \"types\" list:\n{\n  \"compilerOptions\": {\n    \"types\": [\"node\", %s]\n  }\n}\n\nFor for information on TypeScript integration check out: https://webdriver.io/docs/typescript.html\n";
export declare const SUPPORTED_PACKAGES: {
    readonly runner: readonly [{
        readonly name: "local";
        readonly value: "@wdio/local-runner$--$local";
    }];
    readonly framework: readonly [{
        readonly name: "mocha";
        readonly value: "@wdio/mocha-framework$--$mocha";
    }, {
        readonly name: "jasmine";
        readonly value: "@wdio/jasmine-framework$--$jasmine";
    }, {
        readonly name: "cucumber";
        readonly value: "@wdio/cucumber-framework$--$cucumber";
    }];
    readonly reporter: readonly [{
        readonly name: "spec";
        readonly value: "@wdio/spec-reporter$--$spec";
    }, {
        readonly name: "dot";
        readonly value: "@wdio/dot-reporter$--$dot";
    }, {
        readonly name: "junit";
        readonly value: "@wdio/junit-reporter$--$junit";
    }, {
        readonly name: "allure";
        readonly value: "@wdio/allure-reporter$--$allure";
    }, {
        readonly name: "sumologic";
        readonly value: "@wdio/sumologic-reporter$--$sumologic";
    }, {
        readonly name: "concise";
        readonly value: "@wdio/concise-reporter$--$concise";
    }, {
        readonly name: "reportportal";
        readonly value: "wdio-reportportal-reporter$--$reportportal";
    }, {
        readonly name: "video";
        readonly value: "wdio-video-reporter$--$video";
    }, {
        readonly name: "json";
        readonly value: "wdio-json-reporter$--$json";
    }, {
        readonly name: "cucumber";
        readonly value: "wdio-cucumber-reporter$--$cucumber";
    }, {
        readonly name: "mochawesome";
        readonly value: "wdio-mochawesome-reporter$--$mochawesome";
    }, {
        readonly name: "timeline";
        readonly value: "wdio-timeline-reporter$--$timeline";
    }, {
        readonly name: "html";
        readonly value: "@rpii/wdio-html-reporter$--$html";
    }, {
        readonly name: "markdown";
        readonly value: "carmenmitru/wdio-markdown-reporter";
    }];
    readonly service: readonly [{
        readonly name: "chromedriver";
        readonly value: "wdio-chromedriver-service$--$chromedriver";
    }, {
        readonly name: "sauce";
        readonly value: "@wdio/sauce-service$--$sauce";
    }, {
        readonly name: "testingbot";
        readonly value: "@wdio/testingbot-service$--$testingbot";
    }, {
        readonly name: "selenium-standalone";
        readonly value: "@wdio/selenium-standalone-service$--$selenium-standalone";
    }, {
        readonly name: "devtools";
        readonly value: "@wdio/devtools-service$--$devtools";
    }, {
        readonly name: "applitools";
        readonly value: "@wdio/applitools-service$--$applitools";
    }, {
        readonly name: "browserstack";
        readonly value: "@wdio/browserstack-service$--$browserstack";
    }, {
        readonly name: "appium";
        readonly value: "@wdio/appium-service$--$appium";
    }, {
        readonly name: "firefox-profile";
        readonly value: "@wdio/firefox-profile-service$--$firefox-profile";
    }, {
        readonly name: "crossbrowsertesting";
        readonly value: "@wdio/crossbrowsertesting-service$--$crossbrowsertesting";
    }, {
        readonly name: "lambdatest";
        readonly value: "wdio-lambdatest-service$--$lambdatest";
    }, {
        readonly name: "zafira-listener";
        readonly value: "wdio-zafira-listener-service$--$zafira-listener";
    }, {
        readonly name: "reportportal";
        readonly value: "wdio-reportportal-service$--$reportportal";
    }, {
        readonly name: "docker";
        readonly value: "wdio-docker-service$--$docker";
    }, {
        readonly name: "wdio-ui5";
        readonly value: "wdio-ui5-service$--$wdio-ui5";
    }, {
        readonly name: "wiremock";
        readonly value: "wdio-wiremock-service$--$wiremock";
    }, {
        readonly name: "ng-apimock";
        readonly value: "wdio-ng-apimock-service$--ng-apimock";
    }, {
        readonly name: "slack";
        readonly value: "wdio-slack-service$--$slack";
    }, {
        readonly name: "intercept";
        readonly value: "wdio-intercept-service$--$intercept";
    }, {
        readonly name: "docker";
        readonly value: "wdio-docker-service$--$docker";
    }, {
        readonly name: "visual-regression-testing";
        readonly value: "wdio-image-comparison-service$--$visual-regression-testing";
    }, {
        readonly name: "novus-visual-regression";
        readonly value: "wdio-novus-visual-regression-service$--$novus-visual-regression";
    }, {
        readonly name: "rerun";
        readonly value: "wdio-rerun-service$--$rerun";
    }, {
        readonly name: "winappdriver";
        readonly value: "wdio-winappdriver-service$--$winappdriver";
    }, {
        readonly name: "ywinappdriver";
        readonly value: "wdio-ywinappdriver-service$--$ywinappdriver";
    }];
};
export declare const BACKEND_CHOICES: readonly ["On my local machine", "In the cloud using Experitest", "In the cloud using Sauce Labs", "In the cloud using Browserstack or Testingbot or LambdaTest or a different service", "I have my own Selenium cloud"];
export declare const PROTOCOL_OPTIONS: readonly ["https", "http"];
export declare const REGION_OPTION: readonly ["us", "eu"];
export declare const MODE_OPTIONS: readonly ["sync", "async"];
export declare const QUESTIONNAIRE: ({
    type: string;
    name: string;
    message: string;
    choices: readonly [{
        readonly name: "local";
        readonly value: "@wdio/local-runner$--$local";
    }];
    when: () => boolean;
    default?: undefined;
    validate?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    choices: readonly ["On my local machine", "In the cloud using Experitest", "In the cloud using Sauce Labs", "In the cloud using Browserstack or Testingbot or LambdaTest or a different service", "I have my own Selenium cloud"];
    when?: undefined;
    default?: undefined;
    validate?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    when: (answers: any) => boolean;
    choices?: undefined;
    default?: undefined;
    validate?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    default: string;
    choices: readonly ["https", "http"];
    when: (answers: any) => boolean;
    validate?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    default: string;
    when: (answers: any) => any;
    choices?: undefined;
    validate?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    choices: readonly ["us", "eu"];
    when: (answers: any) => boolean;
    default?: undefined;
    validate?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    choices: readonly [{
        readonly name: "mocha";
        readonly value: "@wdio/mocha-framework$--$mocha";
    }, {
        readonly name: "jasmine";
        readonly value: "@wdio/jasmine-framework$--$jasmine";
    }, {
        readonly name: "cucumber";
        readonly value: "@wdio/cucumber-framework$--$cucumber";
    }];
    when?: undefined;
    default?: undefined;
    validate?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    choices: readonly ["sync", "async"];
    when?: undefined;
    default?: undefined;
    validate?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    default: boolean;
    choices?: undefined;
    when?: undefined;
    validate?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    default: boolean;
    when: (answers: any) => any;
    choices?: undefined;
    validate?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    default: (answers: any) => "./test/pageobjects/**/*.js" | "./features/pageobjects/**/*.js";
    when: (answers: any) => any;
    choices?: undefined;
    validate?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    choices: readonly ["Babel (https://babeljs.io/)", "TypeScript (https://www.typescriptlang.org/)", "No!"];
    default: () => "Babel (https://babeljs.io/)" | "TypeScript (https://www.typescriptlang.org/)" | "No!";
    when?: undefined;
    validate?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    choices: readonly [{
        readonly name: "spec";
        readonly value: "@wdio/spec-reporter$--$spec";
    }, {
        readonly name: "dot";
        readonly value: "@wdio/dot-reporter$--$dot";
    }, {
        readonly name: "junit";
        readonly value: "@wdio/junit-reporter$--$junit";
    }, {
        readonly name: "allure";
        readonly value: "@wdio/allure-reporter$--$allure";
    }, {
        readonly name: "sumologic";
        readonly value: "@wdio/sumologic-reporter$--$sumologic";
    }, {
        readonly name: "concise";
        readonly value: "@wdio/concise-reporter$--$concise";
    }, {
        readonly name: "reportportal";
        readonly value: "wdio-reportportal-reporter$--$reportportal";
    }, {
        readonly name: "video";
        readonly value: "wdio-video-reporter$--$video";
    }, {
        readonly name: "json";
        readonly value: "wdio-json-reporter$--$json";
    }, {
        readonly name: "cucumber";
        readonly value: "wdio-cucumber-reporter$--$cucumber";
    }, {
        readonly name: "mochawesome";
        readonly value: "wdio-mochawesome-reporter$--$mochawesome";
    }, {
        readonly name: "timeline";
        readonly value: "wdio-timeline-reporter$--$timeline";
    }, {
        readonly name: "html";
        readonly value: "@rpii/wdio-html-reporter$--$html";
    }, {
        readonly name: "markdown";
        readonly value: "carmenmitru/wdio-markdown-reporter";
    }];
    default: ("@wdio/spec-reporter$--$spec" | "@wdio/dot-reporter$--$dot" | "@wdio/junit-reporter$--$junit" | "@wdio/allure-reporter$--$allure" | "@wdio/sumologic-reporter$--$sumologic" | "@wdio/concise-reporter$--$concise" | "wdio-reportportal-reporter$--$reportportal" | "wdio-video-reporter$--$video" | "wdio-json-reporter$--$json" | "wdio-cucumber-reporter$--$cucumber" | "wdio-mochawesome-reporter$--$mochawesome" | "wdio-timeline-reporter$--$timeline" | "@rpii/wdio-html-reporter$--$html" | "carmenmitru/wdio-markdown-reporter")[];
    when?: undefined;
    validate?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    choices: readonly [{
        readonly name: "chromedriver";
        readonly value: "wdio-chromedriver-service$--$chromedriver";
    }, {
        readonly name: "sauce";
        readonly value: "@wdio/sauce-service$--$sauce";
    }, {
        readonly name: "testingbot";
        readonly value: "@wdio/testingbot-service$--$testingbot";
    }, {
        readonly name: "selenium-standalone";
        readonly value: "@wdio/selenium-standalone-service$--$selenium-standalone";
    }, {
        readonly name: "devtools";
        readonly value: "@wdio/devtools-service$--$devtools";
    }, {
        readonly name: "applitools";
        readonly value: "@wdio/applitools-service$--$applitools";
    }, {
        readonly name: "browserstack";
        readonly value: "@wdio/browserstack-service$--$browserstack";
    }, {
        readonly name: "appium";
        readonly value: "@wdio/appium-service$--$appium";
    }, {
        readonly name: "firefox-profile";
        readonly value: "@wdio/firefox-profile-service$--$firefox-profile";
    }, {
        readonly name: "crossbrowsertesting";
        readonly value: "@wdio/crossbrowsertesting-service$--$crossbrowsertesting";
    }, {
        readonly name: "lambdatest";
        readonly value: "wdio-lambdatest-service$--$lambdatest";
    }, {
        readonly name: "zafira-listener";
        readonly value: "wdio-zafira-listener-service$--$zafira-listener";
    }, {
        readonly name: "reportportal";
        readonly value: "wdio-reportportal-service$--$reportportal";
    }, {
        readonly name: "docker";
        readonly value: "wdio-docker-service$--$docker";
    }, {
        readonly name: "wdio-ui5";
        readonly value: "wdio-ui5-service$--$wdio-ui5";
    }, {
        readonly name: "wiremock";
        readonly value: "wdio-wiremock-service$--$wiremock";
    }, {
        readonly name: "ng-apimock";
        readonly value: "wdio-ng-apimock-service$--ng-apimock";
    }, {
        readonly name: "slack";
        readonly value: "wdio-slack-service$--$slack";
    }, {
        readonly name: "intercept";
        readonly value: "wdio-intercept-service$--$intercept";
    }, {
        readonly name: "docker";
        readonly value: "wdio-docker-service$--$docker";
    }, {
        readonly name: "visual-regression-testing";
        readonly value: "wdio-image-comparison-service$--$visual-regression-testing";
    }, {
        readonly name: "novus-visual-regression";
        readonly value: "wdio-novus-visual-regression-service$--$novus-visual-regression";
    }, {
        readonly name: "rerun";
        readonly value: "wdio-rerun-service$--$rerun";
    }, {
        readonly name: "winappdriver";
        readonly value: "wdio-winappdriver-service$--$winappdriver";
    }, {
        readonly name: "ywinappdriver";
        readonly value: "wdio-ywinappdriver-service$--$ywinappdriver";
    }];
    default: ("wdio-chromedriver-service$--$chromedriver" | "@wdio/sauce-service$--$sauce" | "@wdio/testingbot-service$--$testingbot" | "@wdio/selenium-standalone-service$--$selenium-standalone" | "@wdio/devtools-service$--$devtools" | "@wdio/applitools-service$--$applitools" | "@wdio/browserstack-service$--$browserstack" | "@wdio/appium-service$--$appium" | "@wdio/firefox-profile-service$--$firefox-profile" | "@wdio/crossbrowsertesting-service$--$crossbrowsertesting" | "wdio-lambdatest-service$--$lambdatest" | "wdio-zafira-listener-service$--$zafira-listener" | "wdio-reportportal-service$--$reportportal" | "wdio-docker-service$--$docker" | "wdio-ui5-service$--$wdio-ui5" | "wdio-wiremock-service$--$wiremock" | "wdio-ng-apimock-service$--ng-apimock" | "wdio-slack-service$--$slack" | "wdio-intercept-service$--$intercept" | "wdio-image-comparison-service$--$visual-regression-testing" | "wdio-novus-visual-regression-service$--$novus-visual-regression" | "wdio-rerun-service$--$rerun" | "wdio-winappdriver-service$--$winappdriver" | "wdio-ywinappdriver-service$--$ywinappdriver")[];
    validate: (answers: any) => string | Boolean;
    when?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    default: string;
    choices?: undefined;
    when?: undefined;
    validate?: undefined;
})[];
//# sourceMappingURL=constants.d.ts.map