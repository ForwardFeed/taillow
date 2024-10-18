import { PProcessorData } from "../extractor/preprocessor"
import { TokenReader} from "./token_reader"
import { startGrabbin } from "./grabber"
import { NestedString } from "../utils"

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

const templateFileNest: NestedString = [
    "whateverfile/relative/toprojectpath",[
        "whateverfile/relative/toprojectpath",
        "!whateverfile/That/will/not/be/preprocessed", [
            "#whateverfile/That/will/only/fetch/C/Macros"
        ]
    ]
]



// the entrypoint of this whole file
export function getX(precursor: PProcessorData, finalCb: ()=>void){
    startGrabbin(new TokenReader<TemplateState, TemplateData>({
        stateRec: XStateMap,
        startState: "AwaitBegin",
        data: {whateverdatayouwanttokeep: ""},
        transRec: transitionsMap,
        name: "template - name"
        }),
        templateFileNest, finalCb, undefined, precursor, {
            cInject: cInject,
            fileSeparator: filesSeparator
        }
    )
}