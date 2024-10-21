import { cPreprocessFileNest2, PProcessorData } from "../../extractor/preprocessor"
import { tokenize } from "../../extractor/tokenizer"
import { extendNestedFilePathWithProjectPath } from "../../extractor/parse_utils"
import { projectPath } from "../../config_handler"
import { logWarn } from "../../logging"
import { TokenReader} from "../token_reader"
import { Ability } from "./ability"



type Abis = Map<string, Ability>
type Reader = TokenReader<AbisState, Abis>
type AbisState = "GrabDesc" | "Name" | "LinkPtr"


const descMap = new Map()

const XStateMap: Record<AbisState, (reader: Reader)=>void> = {
    GrabDesc: (r: Reader) => {
        if (r.checkPattern("static", "const")){
            descMap.set(r.peekToken(3), r.multiTokenPattern("=", ";").join(''))
        }
    },
    Name: (r: Reader): void => {
        const obj = r.parseC()
        const keys = Object.keys(obj)
        for (let NAME of keys){
            const fields = obj[NAME]
            r.data.set(NAME, {
                name: fields,
                desc: "",
                internalID: -1
            })
        }
        r.deactivateStateUntilTrans()
    },
    LinkPtr: (r: Reader): void => {
        const obj = r.parseC()
        const keys = Object.keys(obj)
        for (let NAME of keys){
            const fields = obj[NAME][0]
            const prev = r.data.get(NAME)
            if (!prev)
                continue
            prev.desc = descMap.get(fields) || "dataing error"
        }
        r.deactivateStateUntilTrans()
    }
}
const cInject = `
#define _(A...) A
`
const filesSeparator = "__END_OF_FILE__"
const transitionsMap: Record<AbisState, [string, AbisState] | [string]>= {
    GrabDesc: ["gAbilityNames", "Name"],
    Name: ["gAbilityDescriptionPointers", "LinkPtr"],
    LinkPtr: [filesSeparator],
}

const abilitiesFileNest = [
     "src/data/text/abilities.h",[
       "include/constants/abilities.h"
    ]
]

export function getER21Abilities(precursor: PProcessorData, finalCb: (abis: Map<string, Ability>)=>void){
    cPreprocessFileNest2(extendNestedFilePathWithProjectPath(abilitiesFileNest, projectPath), precursor, cInject, filesSeparator)
    .then((filedata)=>{
        const data = reader(filedata.str)
        data.forEach((val, key)=>{
            val.internalID = +(filedata.ppm.has(key) ? filedata.ppm.get(key)?.join() as string : -1)
        })
        finalCb(data)
    })
    .catch((err)=>{
        logWarn(err)
    })
}

function reader(fileData: string){
    const reader = new TokenReader<AbisState, Abis>({
        tokens: tokenize(fileData),
        stateRec: XStateMap,
        startState: "GrabDesc",
        data: new Map(),
        transRec: transitionsMap,
        name: "template - name"
    })
    return reader.start()
}
