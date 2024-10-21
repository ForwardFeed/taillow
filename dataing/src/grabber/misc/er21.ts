import { PProcessorData } from "../../extractor/preprocessor"
import { TokenReader} from "../token_reader"
import { startGrabbin } from "../grabber"
import { NestedString } from "../../utils"


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

const transitionsMap: Record<TemplateState, [string, TemplateState] | [string]>= {
    items: [""]
}

const templateFileNest: NestedString = [
    "src/data/items.h",
    "#include/constants/pokemon.h",
]


// the entrypoint of this whole file
export function getER21NaturesTypes(precursor: PProcessorData, finalCb: (any: NatureTypesItems)=>void){
    const reader = new TokenReader<TemplateState, NatureTypesItems>({
        stateRec: XStateMap,
        startState: "items",
        data: {
            natures: [],
            types: [],
            items: []
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