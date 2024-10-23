import { PProcessorData } from "../../extractor/preprocessor"
import { TokenReader} from "../token_reader"
import { startGrabbin } from "../grabber"
import { NestedString } from "../../utils"
import { tokenize } from "../../extractor/tokenizer"


type NatureTypesItems =  {
    natures: string[],
    types: string[],
    items: string[]
}

type Reader = TokenReader<TemplateState, NatureTypesItems>

type TemplateState = "items"

const XStateMap: Record<TemplateState, (r: Reader)=>void> = {
    items: (reader: Reader) => {
        if (!reader.checkToken("gItems")){
            return
        }
        const obj = reader.parseCObj()
        reader.data.items = Object.keys(obj)
    },
}

const cInject = `
`
const filesSeparator = "__END_OF_FILE__" 

const transitionsMap: Record<TemplateState, [string, TemplateState] | [string]>= {
    items: [filesSeparator]
}

const templateFileNest: NestedString = [
    "src/data/items.h",
    "#include/constants/pokemon.h",
]


export function getER25NaturesTypesItems(precursor: PProcessorData, finalCb: (any: NatureTypesItems)=>void){
    const reader = new TokenReader<TemplateState, NatureTypesItems>({
        stateRec: XStateMap,
        startState: "items",
        data: {
            natures: [],
            types: [],
            items: []
        },
        transRec: transitionsMap,
        name: "er25 - naturesTypesItems",
        })
    startGrabbin(reader,
        templateFileNest, finalCb, (ppmd)=>{
            ppmd.ppm.forEach((val, key)=>{
                if (key.match(/^TYPE/)){
                    if (key == "TYPE_NONE" || key == "TYPE_CURRENT_MOVE") return
                    reader.data.types[+val] = key
                }
                if (key.match(/^NATURE_/)){
                    reader.data.natures.push(key)
                }
            })
            finalCb(reader.start(tokenize(ppmd.str)))
        }, precursor, {
            cInject: cInject,
            fileSeparator: filesSeparator,
        }
    )
}