import path from "path"
import { parseCLIArgs, parseCLIArgsValue } from "./cli_args"
import { exportData } from "./export_data"
import { logError, logInform, logWarn } from "./logging"
import { readFileSync, writeFileSync } from "fs"
import { cPreprocessFileNest2, preprocessor } from "./preprocessor"
import { readConfigValue } from "./config_handler"
import { tokenize } from "./tokenizer"
import { normalize, uncomment} from "./parse_utils"


export function makeTests(){
    logInform("starting tests")
    const commentFile   = 'src/c_parser/tests/comments.txt'
    const normalizeFile = 'src/c_parser/tests/normalize.txt'
    const preprocssFile = 'src/c_parser/tests/preProcessingMacros.txt'
    const tokenFile     = 'src/c_parser/tests/tokenizer.txt'
    const cparserFile   = 'src/c_parser/tests/c_parser.txt'
    //const uncommentorTest = readFileSync(path.join(commentFile), 'utf-8')
    //console.log(uncomment(uncommentorTest))
    //const normalizatorTest = readFileSync(path.join(normalizeFile), 'utf-8')
    //console.log(normalize(normalizatorTest))
    //const preprocessorTest = preprocessor(uncomment(normalize(readFileSync(path.join(preprocssFile), 'utf-8'))))
    //console.log(preprocessorTest)
    /*cPreprocessFileNest([normalizeFile, commentFile, [preprocssFile]], (data)=>{
        console.log(data)
        logInform("ending tests")
    }, {str: "", ppm: new Map()})*/
    //console.log(tokenize(readFileSync(path.join(tokenFile), "utf-8")))
    //cParser(readFileSync(path.join(cparserFile), "utf-8"))
    //logInform("ending tests")
}