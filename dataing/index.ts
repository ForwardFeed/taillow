import { parseCLIArgs, parseCLIArgsValue } from "./src/cli_args"
import { logError, logInform, logWarn } from "./src/logging"
import { readConfig, readConfigValue } from "./src/config"
import { makeTests } from "./src/tests"
import { grab } from "./src/grabber/grabber"

function main(){
    logInform("dataing started")   
    const params = parseCLIArgs()
    if (params == parseCLIArgsValue.ASKED_HELP){
        return logInform("dataing ended")
    }else if (params == parseCLIArgsValue.ERR){
        logError("Error while parsing process arguments.")
        return logInform("dataing ended")  
    }
    if (readConfig() == readConfigValue.ERR){
        return logInform("dataing ended")  
    }
    grab()
}


if(true){
    main()
} else {
    makeTests()
}


