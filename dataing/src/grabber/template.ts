import { PProcessorData, cPreprocessFileNest2 } from "../preprocessor"
import { tokenize } from "../tokenizer"
import { extendNestedFilePathWithProjectPath } from "../parse_utils"
import { projectPath } from "../config_handler"
import { logWarn } from "../logging"
import { TokenReader} from "../token_reader"

// the type of the data you're parsing for [just refactor this name]
type TemplateData = {
    whateverdatayouwanttokeep: string
}
// Simplify the signature
type Reader = TokenReader<TemplateState, TemplateData>

// list of all states you go throught [just refactor this name]

type TemplateState = "AwaitBegin" | "AwaitEnd"

const XStateMap: Record<TemplateState, (reader: Reader)=>void> = {
    AwaitBegin: (reader: Reader) => {
        reader.tokenToState(filesSeparator, "AwaitEnd")
        reader.data.whateverdatayouwanttokeep = "will be kept"
    },
    AwaitEnd: (reader: Reader): void => {
        
    }
}
const cInject = `
`
const filesSeparator = "__END_OF_FILE__"
const transitionsMap: Record<TemplateState, [string, TemplateState] | [string]>= {
    AwaitBegin: [filesSeparator, "AwaitEnd"],
    AwaitEnd: [filesSeparator],
}

const templateFileNest = [
    "whateverfile/relative/toprojectpath",[
        "whateverfile/relative/toprojectpath",
    ]
]

export function getX(precursor: PProcessorData, finalCb: ()=>void){
    cPreprocessFileNest2(extendNestedFilePathWithProjectPath(templateFileNest, projectPath), precursor, cInject, filesSeparator)
    .then((filedata)=>{
        const template = reader(filedata.str)
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
        transRec: transitionsMap
    })
    return reader.start()
}
