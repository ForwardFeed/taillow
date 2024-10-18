import { parseCLIArgs, parseCLIArgsValue } from "./src/cli_args"
import { logError, logInform, logSuccess, logWarn } from "./src/logging"
import { readConfigValue } from "./src/config_handler"
import { makeTests } from "./src/extractor/tests"
import { grabGameData } from "./src/grabber/grab_data"

function main(){
    logInform("dataing started")   
    const params = parseCLIArgs()
    if (params == parseCLIArgsValue.ASKED_HELP){
        logSuccess("asking help, stopping")
    }else if (params == parseCLIArgsValue.ERR){
        logError("Error while processing command line arguments. stopping")
    } else {
        grabGameData()
    }
}


if(true){
    main()
} else {
    makeTests()
}


