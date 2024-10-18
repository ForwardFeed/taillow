import { PProcessorData } from "../../extractor/preprocessor"
import { TokenReader} from "../token_reader"
import { startGrabbin } from "../grabber"
import { NestedString } from "../../utils"


type NatureTypes =  {
    natures: string[],
    types: string[]
}

type Reader = TokenReader<TemplateState, NatureTypes>

type TemplateState = "NOP"

const XStateMap: Record<TemplateState, (r: Reader)=>void> = {
    NOP: (reader: Reader) => {
        reader.end()
    },
}

const cInject = `
`

const transitionsMap: Record<TemplateState, [string, TemplateState] | [string]>= {
    NOP: [""]
}

const templateFileNest: NestedString = [
    "#include/constants/pokemon.h"
]


// the entrypoint of this whole file
export function getER21NaturesTypes(precursor: PProcessorData, finalCb: (any: NatureTypes)=>void){
    const reader = new TokenReader<TemplateState, NatureTypes>({
        stateRec: XStateMap,
        startState: "NOP",
        data: {
            natures: [],
            types: []
        },
        transRec: transitionsMap,
        name: "template - name",
        })
    startGrabbin(reader,
        templateFileNest, finalCb, (ppmd)=>{
            ppmd.ppm.forEach((val, key)=>{
                if (key.match(/^TYPE/)){
                    if (key == "TYPE_NONE" || key == "TYPE_CURRENT_MOVE") return
                    reader.data.types[+val] = key
                }
                if (key.match(/^NATURE_/)){
                    reader.data.natures[+val] = key
                }
            })
        }, precursor, {
            cInject: cInject,
        }
    )
}