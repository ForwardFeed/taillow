import clc from "cli-color"
import { programParams } from "./parameters"

enum LogLevels {
    DEBUG,      // everything
    INFORM,     // no debug,
    SUCCESS,    // no inform, debug
    WARN,       // no inform, success, debug
    ERROR,      // no inform, success, warn, debug
    NONE        // completely silent
}

export const ERROR   = clc.bold.bgBlack.redBright   ("ERRR:") + " "
export const WARN    = clc.bold.bgBlack.yellowBright("WARN:") + " "
export const SUCCES  = clc.bold.bgBlack.greenBright ("OKAY:") + " "
export const DEBUG   = clc.bold.bgBlack.whiteBright ("DEBG:") + " "
export const INFORM  = clc.bold.bgBlack.blueBright  ("INFO:") + " "

export function log(loglevel: LogLevels, text: string){
    if (programParams.debugLevel > loglevel){
        return
    }
    if (loglevel == LogLevels.ERROR){
        console.error(text)
    } else if (loglevel == LogLevels.WARN){
        console.warn(text)
    } else {
        console.log(text)
    }
}

export function logDebug(text: string, autoAdd=true){
    log(LogLevels.DEBUG, autoAdd ? `${DEBUG}${text}` : text)
}
export function logInform(text: string, autoAdd=true){
    log(LogLevels.INFORM, autoAdd ? `${INFORM}${text}` : text)
}
export function logSuccess(text: string, autoAdd=true){
    log(LogLevels.SUCCESS, autoAdd ? `${SUCCES}${text}` : text)
}
export function logWarn(text: string, autoAdd=true){
    log(LogLevels.WARN, autoAdd ? `${WARN}${text}`  : text)
}
export function logError(text: string, autoAdd=true){
    log(LogLevels.ERROR, autoAdd ? `${ERROR}${text}` : text)
}

export default {
    error: ERROR,
    success: SUCCES,
    logSuccess: logSuccess,
}