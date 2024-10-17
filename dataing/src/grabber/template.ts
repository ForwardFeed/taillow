import { PProcessorData, cPreprocessFileNest2 } from "../extractor/preprocessor"
import { tokenize } from "../extractor/tokenizer"
import { extendNestedFilePathWithProjectPath } from "../extractor/parse_utils"
import { projectPath } from "../config_handler"
import { logWarn } from "../logging"
import { TokenReader} from "./token_reader"

// the type of the data you're parsing for [just refactor this name]
type TemplateData = {
    whateverdatayouwanttokeep: string
}
// Simplify the signature
type Reader = TokenReader<TemplateState, TemplateData>

// list of all states you go throught 

type TemplateState = "AwaitBegin" | "AwaitEnd"

const XStateMap: Record<TemplateState, (reader: Reader)=>void> = {
    AwaitBegin: (reader: Reader) => {
        reader.tokenToState(filesSeparator, "AwaitEnd")
        reader.data.whateverdatayouwanttokeep = "will be kept"
    },
    AwaitEnd: (reader: Reader): void => {
        
    }
}

// Inject raw C code, for exemple cherry pick some macros that are sometimes lost in the codebase
const cInject = `
`
// This will inject a token at the end of the file that will have this name
// Allows to track when you jump from a file to another
const filesSeparator = "__END_OF_FILE__"

// Transitions State, before the StateMap is read, if a token matches the string, then the token reader jump 
// from states
const transitionsMap: Record<TemplateState, [string, TemplateState] | [string]>= {
    AwaitBegin: [filesSeparator, "AwaitEnd"],
    AwaitEnd: [filesSeparator],
}
// this is a file nest where each block is read in a sequence
// There is two tricks, 
// If you start a filename with ! it will not be Preprocessed (C macros)
// if you start a #, only the preprocessing macros will be read

const templateFileNest = [
    "whateverfile/relative/toprojectpath",[
        "whateverfile/relative/toprojectpath",
        "!whateverfile/That/will/not/be/preprocessed", [
            "#whateverfile/That/will/only/fetch/C/Macros"
        ]
    ]
]
// the entrypoint of this whole file
export function getX(precursor: PProcessorData, finalCb: ()=>void){
    cPreprocessFileNest2(extendNestedFilePathWithProjectPath(templateFileNest, projectPath), precursor, cInject, filesSeparator)
    .then((filedata)=>{
        const template = reader(filedata.str)
        // you can access C preprocessing macros using filedata.ppm, useful to get IDs
        finalCb()
    })
    .catch((err)=>{
        logWarn(err)
    })
}

function reader(fileData: string){
    const reader = new TokenReader<TemplateState, TemplateData>({
        tokens: tokenize(fileData),
        stateRec: XStateMap,
        startState: "AwaitBegin",
        data: {whateverdatayouwanttokeep: ""},
        transRec: transitionsMap,
        name: "template - name"
    })
    return reader.start()
}
