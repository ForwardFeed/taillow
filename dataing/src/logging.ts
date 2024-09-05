import clc from "cli-color"
import { createWriteStream } from "node:fs"



export enum LogLevels {
    DEBUG,      // everything
    INFORM,     // no debug,
    SUCCESS,    // no inform, debug
    WARN,       // no inform, success, debug
    ERROR,      // no inform, success, warn, debug
    NONE        // completely silent
}

export type LogsLevelStr = "DEBUG" | "INFORM" | "SUCCESS" | "WARN" | "ERROR" | "NONE"

export const ERROR   = clc.bold.bgBlack.redBright   ("ERRR:") + " "
export const WARN    = clc.bold.bgBlack.yellowBright("WARN:") + " "
export const SUCCES  = clc.bold.bgBlack.greenBright ("OKAY:") + " "
export const DEBUG   = clc.bold.bgBlack.whiteBright ("DEBG:") + " "
export const INFORM  = clc.bold.bgBlack.blueBright  ("INFO:") + " "

const logFile = createWriteStream("dataing_logfile.log", {
    flush: true,
    flags: "w",
    encoding: "utf-8",
})

let loglevel = LogLevels.DEBUG

export function setLogLevels(pLoglevel: string){
    loglevel = LogLevels[pLoglevel as keyof typeof LogLevels]
    //loglevel = pLoglevel
}

export function log(ploglevel: LogLevels, text: string){
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

export default {
    error: ERROR,
    success: SUCCES,
    logSuccess: logSuccess,
}