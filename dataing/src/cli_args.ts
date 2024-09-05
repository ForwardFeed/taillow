import minimist from 'minimist';
import { logError, logInform, LogLevels, logWarn, setLogLevels as setLogLevel } from './logging';
import clc from 'cli-color';
import { loadExternalConfig } from './config_handler';

type ParamRules = {
    optional?: boolean,
    param:     string,
    alias?:    string,
    desc:      string[],
    example?:  string,
    default:   any,
    typecheck: (any: any)=>boolean,
    exec:      (any: any)=>void
}

export type Parameters = {
    configPath: string,
    debugLevel: number, 
}

const params: {[key in keyof Parameters]: ParamRules} = {
    configPath: {
        optional: true,
        param: "config-path",
        alias: "c",
        desc: [
            "give the config file path to take in input",
        ],
        default: "",
        typecheck: (path: string)=>{
            return !!path
        },
        exec: (path: string)=>{
            loadExternalConfig(path)
        }
    },
    debugLevel: {
        optional: true,
        param: 'debug-level',
        alias: undefined,
        desc: ["set the debug volume"],
        example: "--debug-level=4 OR --debug-level=WARN",
        default: "0",
        typecheck: (logLevel: string)=>{
            if (Object.values(LogLevels).includes(logLevel)) {
                return true
            }
            return false
        },
        exec: (logLevel: string)=>{
            setLogLevel(logLevel)
        }
    }
}

function printHelp(){
    logInform("Printing help")
    const keyF       = clc.bold.bgBlack.cyan
    const commandF    = clc.bold.bgBlack.green
    const descF       = clc.italic
    const fieldF    = clc.bold.bgBlack.blue
    const tab = "    "
    const helpText = `${keyF("help")}:${tab}${commandF("--help:")}${tab}${commandF("-h")}
${tab}${descF("Show this message")}\n`
    let key: keyof typeof params
    for (key in params){
        const param = params[key]
        const descText = param.desc.map((x)=> descF(`${tab}${x}`)).join("\n")
        console.log(
`${keyF(key)}:\t${commandF("--" + param.param)}${param.alias ? tab + commandF("-" + param.alias) :""}\
${descText ? "\n" + descText: ""}
${tab}${fieldF("type:")} ${typeof param.default}
${tab}${fieldF("default:")} ${param.default}`
        )
    }
    // print in stdout regardless of the log level
    console.log(helpText)
    logInform("End of printing help")
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
    let key: keyof typeof params
    for (key in params){
        const param = params[key]
        let value = argv[param.param]
        if (value == undefined && param.alias){
            value = argv[param.alias]
            //deleting because i'll check if invaluable flags were given to warn the user
            if (value)
                delete argv[param.alias]
        } else {
            delete argv[param.param]
        }
        if (value == undefined){
            if (!param.optional){
                logError(`param: ${param.param} is mandatory but wasn't found in the data`)
                errorInParsing = true
            }
            continue
        }
        if (!param.typecheck(value)){
            logError(`\
param: ${param.param} is wrongly typed (value is: ${value})`)
            errorInParsing = true
        } else {
            param.exec(value)
        }
    }
    for (let key in argv){
        if (key == "_")
            continue
        logWarn(`param ${key} with value ${argv[key]} wasn't recognized and thus was ignored`)
    }
    return errorInParsing ?  parseCLIArgsValue.ERR : parseCLIArgsValue.OK
}