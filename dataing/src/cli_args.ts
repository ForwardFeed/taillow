import minimist from 'minimist';
import { logError, logInform, LogLevels, LogsLevelStr, logWarn, setLogLevels as setLogLevel } from './logging';
import clc from 'cli-color';
import { changeChosenConfig, chosenConfig, fullConfig, loadExternalConfig, readConfigValue } from './config_handler';
import { VersionsAvailable } from '../config';
type ParamRules = {
    optional?: boolean,
    param:     string,
    alias?:    string,
    desc:      string[],
    example?:  string,
    default:   any,
    // return true if it's invalid, or an error message to say something went wrong with a message of error
    // or reaturn false as everything is okay
    typecheck: (value: any)=> string | boolean,
    // return true if it's invalid, so there has been an error
    // or return false as everything is okay
    exec:      (value: any)=> boolean,
    // return true is there has been an error
    // return false as everything is is okay
    postParseCheck?: ()=>boolean
}

export const formatExport = ["JSON", "GZIP"] as const
export type FormatExport = (typeof formatExport)[number]

export type Parameters = {
    configPath   : string,
    debugLevel   : number,
    active       : VersionsAvailable,
    spritesOnly  : boolean,
    export       : string,
    format       : FormatExport
}

const paramStaticData: {[key in keyof Parameters]: ParamRules} = {
    configPath: {
        optional: true,
        param: "config-path",
        alias: "c",
        desc: [
            "give the config file path to take in input (in JSON!)",
            "Btw I did not tested it for now :3"
        ],
        default: "config.ts",
        typecheck: (path: string) => {
            if (!path) return true;
            return false;
        },
        exec: (path: string) => {
            parameters.configPath = path;
            if (loadExternalConfig(path) == readConfigValue.ERR) {
                return true;
            }
            return false;
        }
    },
    debugLevel: {
        optional: true,
        param: 'debug-level',
        alias: undefined,
        desc: ["set the debug level"],
        example: "--debug-level=4 OR --debug-level=WARN",
        default: fullConfig.logLevel,
        typecheck: (logLevel: string) => {
            if (Object.values(LogLevels).includes(logLevel)) {
                return false;
            }
            return `debug level must be one of the following : ${Object.values(LogLevels).join(', ')}`;
        },
        exec: (logLevel: string) => {
            parameters.debugLevel = LogLevels[logLevel as LogsLevelStr];
            setLogLevel(logLevel);
            return false;
        }
    },
    active: {
        optional: true,
        param: 'active',
        alias: 'a',
        desc: ["set the version to read",
            "(overrides the active field in the config)"
        ],
        example: "--active vanilla",
        default: fullConfig.active,
        typecheck: function (version: any) {
            if (~Object.keys(fullConfig.list).indexOf(version)) {
                return false;
            }
            return `debug level must be one of the following : ${Object.keys(fullConfig.list).join(', ')}`;
        },
        exec: function (version: any) {
            parameters.active = version;
            changeChosenConfig(version);
            return false;
        }
    },
    spritesOnly: {
        optional: true,
        param: 'sprites-only',
        alias: undefined,
        desc: ["Export Sprites only"],
        example: "--sprites-only",
        default: false,
        typecheck: function () {
            return false;
        },
        exec: function () {
            parameters.spritesOnly = true;
            return false;
        }
    },
    export: {
        optional: true,
        param: 'export',
        alias: 'e',
        desc: ["Give the instruction put move all the data into a folder",
            "the folder will be containing /json /gzip and /img"
        ],
        example: "--export ../",
        default: "dataOutput",
        typecheck: function (value: any): string | boolean {
            // todo check if the path is valid 
            // do it if it would have saved you troubles once
            if (typeof value !== "string"){
                return "exports requires a folder path, can be relative"
            }
            return false
        },
        exec: function (value: any): boolean {
            parameters.export = value
            return false
        }
    },
    format: {
        optional: true,
        param: 'format',
        alias: 'f',
        desc: ["gamedata format that is exported, both are json but one is compressed in gzip"],
        example: "--format gzip, -f json",
        default: "GZIP",
        typecheck: function (value: any): string | boolean {
            if (typeof value === "string"){
                //@ts-ignore
                if (!formatExport.includes(value.toUpperCase())){
                    return `format must be one of: ${formatExport.map(x => `${x}/${x.toLowerCase()}`)}`
                }
                return false
            }
            return `format must be one of: ${formatExport.map(x => `${x}/${x.toLowerCase()}`).join(', ')}`
        },
        exec: function (value: any): boolean {
            parameters.format = value.toUpperCase()
            return false
        }
    }
}

export const parameters: Parameters = {
    configPath: paramStaticData.configPath.default,
    debugLevel: paramStaticData.debugLevel.default,
    active: paramStaticData.active.default,
    spritesOnly: paramStaticData.spritesOnly.default,
    export: paramStaticData.export.default,
    format: paramStaticData.format.default,
}


function printHelp(){
    logInform("Printing help")
    const keyF        = clc.bold.bgBlack.cyan
    const commandF    = clc.bold.bgBlack.green
    const descF       = clc.italic
    const fieldF      = clc.bold.bgBlack.blue
    const spaceKey    = " ".repeat(Math.max(0, 14 - "help".length))
    const tab         = "    "
    const helpText    = `${keyF("help")}:${spaceKey}${commandF("-h")}${tab}${commandF("--help:")}
${tab}${descF("Show this message")}\n`
    let key: keyof typeof paramStaticData
    for (key in paramStaticData){
        const spaceKey = " ".repeat(Math.max(0, 14 - key.length))
        const param = paramStaticData[key]
        const descText = param.desc.map((x)=> descF(`${tab}${x}`)).join("\n")
        console.log(
`${keyF(key)}:${spaceKey}${param.alias ? commandF("-" + param.alias) :"  "}${tab}${commandF("--" + param.param)}\
${descText ? "\n" + descText: ""}
${tab}${fieldF("type:")} ${typeof param.default}
${tab}${fieldF("default:")} ${param.default}\n`
        )
    }
    // print in stdout regardless of the log level
    console.log(helpText)
}

export enum parseCLIArgsValue{
    OK,
    ERR,
    ASKED_HELP
}

// Default values 
// This does not check the typing, It's a bit annoying
export function parseCLIArgs(): parseCLIArgsValue{
    let errorInParsing = false
    const argv = minimist(process.argv.slice(2));
    if (argv["h"] || argv["help"]){
        printHelp()
        return parseCLIArgsValue.ASKED_HELP
    }
    let key: keyof typeof paramStaticData
    for (key in paramStaticData){
        const param = paramStaticData[key]
        let value = argv[param.param]
        if (argv[param.param] && param.alias && argv[param.alias]){
            logWarn(`--${param.param} && -${param.alias} are duplicating, the full parameter --${param.param} will take priority`)
            delete argv[param.alias]
        }
        if (value == undefined && param.alias){
            value = argv[param.alias]
            delete argv[param.alias]
        }
        // i delete it because it will be left in the pile
        // and the unrecognized params will be confused
        delete argv[param.param]
        if (value == undefined){
            if (!param.optional){
                logError(`cli-args: ${param.param} is mandatory but wasn't found in the data`)
                errorInParsing = true
            }
            continue
        }
        const paramErrorMsg = param.typecheck(value)
        if (paramErrorMsg !== false){
            if (paramErrorMsg){
                logError(`cli-args: --${param.param} is wrongly typed: ${paramErrorMsg}`)
            } else {
                logError(`cli-args: --${param.param} is wrongly typed : (value is: ${value})`)
            }
            errorInParsing = true
        } else {
            errorInParsing = param.exec(value)  || errorInParsing
        }
    }
    for (let key in argv){
        if (key == "_")
            continue
        logWarn(`cli-args ${key} with value ${argv[key]} wasn't recognized and thus was ignored`)
    }
    // post parse check to see if there is any conflict
    for (key in paramStaticData){
        const param = paramStaticData[key]
        if (param.postParseCheck){
            errorInParsing = param.postParseCheck() || errorInParsing
        }
    }
    return errorInParsing ?  parseCLIArgsValue.ERR : parseCLIArgsValue.OK
}