import clc from "cli-color"
import { createWriteStream } from "node:fs"
import { fullConfig } from "./config_handler"
import { config } from "../../config"



export enum LogLevels {
    PERF,       // everything
    DEBUG,      // no perf, 
    INFORM,     // no debug, perf
    SUCCESS,    // no inform, debug, perf
    WARN,       // no inform, success, debug, perf
    ERROR,      // no inform, success, warn, debug, perf
    NONE        // completely silent
}

export type LogsLevelStr = keyof typeof LogLevels

const ERROR   = clc.bold.bgBlack.redBright   ("ERRR:") + " "
const WARN    = clc.bold.bgBlack.yellowBright("WARN:") + " "
const SUCCES  = clc.bold.bgBlack.greenBright ("OKAY:") + " "
const DEBUG   = clc.bold.bgBlack.whiteBright ("DEBG:") + " "
const INFORM  = clc.bold.bgBlack.blueBright  ("INFO:") + " "
const PERF    = clc.bold.bgBlack.magenta     ("PERF:") + " "

const logFile = createWriteStream("dataing_logfile.log", {
    flush: true,
    flags: "w",
    encoding: "utf-8",
})


let loglevel =  LogLevels[config.logLevel]

export function setLogLevels(pLoglevel: string){
    loglevel = LogLevels[pLoglevel as keyof typeof LogLevels]
}

function log(ploglevel: LogLevels, text: string){
    if (loglevel > ploglevel){
        logFile.write(clc.strip(text) + "\n")
    } else if (ploglevel == LogLevels.ERROR){
        console.error(text)
    } else if (ploglevel == LogLevels.WARN){
        console.warn(text)
    } else {
        console.log(text)
    }
}

export function logDebug(...text: string[]){
    log(LogLevels.DEBUG, `${DEBUG}${text}`)
}
export function logInform(...text: string[]){
    log(LogLevels.INFORM, `${INFORM}${text}`)
}
export function logSuccess(...text: string[]){
    log(LogLevels.SUCCESS, `${SUCCES}${text}`)
}
export function logWarn(...text: string[]){
    log(LogLevels.WARN, `${WARN}${text}`)
}
export function logError(...text: string[]){
    log(LogLevels.ERROR, `${ERROR}${text}`)
}

export function logPerf(prevTime?: number, text?: string, timeIt = true): number{
    let time = Date.now() 
    if (prevTime != undefined){
        const delta = time - prevTime
        const spaces = " ".repeat(Math.max(0, 4 - (delta + "").length ))
        log(LogLevels.PERF, `${PERF}${timeIt ? `${delta}${spaces}ms :` : ""}${text}`)
    }
    return time   
}