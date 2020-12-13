import { ConfigCommandArguments } from '../types';
import yargs from 'yargs';
export declare const command = "config";
export declare const desc = "Initialize WebdriverIO and setup configuration in your current project.";
export declare const cmdArgs: {
    readonly yarn: {
        readonly type: "boolean";
        readonly desc: "Install packages via yarn package manager.";
        readonly default: boolean;
    };
    readonly yes: {
        readonly alias: "y";
        readonly desc: "will fill in all config defaults without prompting";
        readonly type: "boolean";
        readonly default: false;
    };
};
export declare const builder: (yargs: yargs.Argv<{}>) => yargs.Argv<yargs.Omit<{}, "yarn" | "yes"> & yargs.InferredOptionTypes<{
    readonly yarn: {
        readonly type: "boolean";
        readonly desc: "Install packages via yarn package manager.";
        readonly default: boolean;
    };
    readonly yes: {
        readonly alias: "y";
        readonly desc: "will fill in all config defaults without prompting";
        readonly type: "boolean";
        readonly default: false;
    };
}>>;
export declare function handler(argv: ConfigCommandArguments): Promise<void>;
export declare function missingConfigurationPrompt(command: string, message: string, useYarn?: boolean, runConfigCmd?: (useYarn: boolean, yes: boolean, exit?: boolean) => Promise<false | undefined>): Promise<false | undefined>;
//# sourceMappingURL=config.d.ts.map