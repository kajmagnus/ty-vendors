export default SpecReporter;
declare class SpecReporter extends WDIOReporter {
    constructor(options: any);
    symbols: {
        passed: any;
        skipped: any;
        failed: any;
    };
    suiteUids: any[];
    indents: number;
    suiteIndents: {};
    defaultTestIndent: string;
    stateCounts: {
        passed: number;
        failed: number;
        skipped: number;
    };
    chalk: chalk.Chalk & chalk.ChalkFunction & {
        supportsColor: false | chalk.ColorSupport;
        Level: chalk.Level;
        Color: "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray" | "grey" | "blackBright" | "redBright" | "greenBright" | "yellowBright" | "blueBright" | "magentaBright" | "cyanBright" | "whiteBright" | "bgBlack" | "bgRed" | "bgGreen" | "bgYellow" | "bgBlue" | "bgMagenta" | "bgCyan" | "bgWhite" | "bgGray" | "bgGrey" | "bgBlackBright" | "bgRedBright" | "bgGreenBright" | "bgYellowBright" | "bgBlueBright" | "bgMagentaBright" | "bgCyanBright" | "bgWhiteBright";
        ForegroundColor: "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray" | "grey" | "blackBright" | "redBright" | "greenBright" | "yellowBright" | "blueBright" | "magentaBright" | "cyanBright" | "whiteBright";
        BackgroundColor: "bgBlack" | "bgRed" | "bgGreen" | "bgYellow" | "bgBlue" | "bgMagenta" | "bgCyan" | "bgWhite" | "bgGray" | "bgGrey" | "bgBlackBright" | "bgRedBright" | "bgGreenBright" | "bgYellowBright" | "bgBlueBright" | "bgMagentaBright" | "bgCyanBright" | "bgWhiteBright";
        Modifiers: "reset" | "bold" | "dim" | "italic" | "underline" | "inverse" | "hidden" | "strikethrough" | "visible";
        stderr: chalk.Chalk & {
            supportsColor: false | chalk.ColorSupport;
        };
    };
    printReport(runner: any): void;
    getTestLink({ config, sessionId, isMultiremote, instanceName }: {
        config: any;
        sessionId: any;
        isMultiremote: any;
        instanceName: any;
    }): string[];
    getHeaderDisplay(runner: Object): any[];
    getEventsToReport(suite: Object): Object[];
    getResultDisplay(): any[];
    getCountDisplay(duration: string): any[];
    getFailureDisplay(): any[];
    getOrderedSuites(): any[];
    orderedSuites: any[] | undefined;
    indent(uid: string): string;
    getSymbol(state: string): string;
    getColor(state: string): string;
    getEnviromentCombo(caps: Object, verbose?: boolean, isMultiremote?: boolean): string;
}
import WDIOReporter from "@wdio/reporter";
import chalk from "chalk";
//# sourceMappingURL=index.d.ts.map