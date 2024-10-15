import { cPreprocessFileNest2, PProcessorData } from "../../extractor/preprocessor"
import { tokenize } from "../../extractor/tokenizer"
import { extendNestedFilePathWithProjectPath } from "../../extractor/parse_utils"
import { projectPath } from "../../config_handler"
import { logError, logInform, logWarn } from "../../logging"
import { TokenReader} from "../token_reader"
import { getItemFromMap, resolveNumber, resolveString } from "../utils"
import { NestedString } from "../../utils_types"
import { SpecieSpriteData } from "./sprites"


type spritesData =  Map<string, SpecieSpriteData>
type Reader = TokenReader<TemplateState, spritesData>

type TemplateState =  "pokemon" | "front" | "back" | "pal" | "shinyPal"

const ptrMap: Map<string, string> = new Map()

const XStateMap: Record<TemplateState, (reader: Reader)=>void> = {
    pokemon: function (r: Reader): void {
        if (r.checkToken("const")){
            const ptr = r.getToken(2)
            //const path = r.getToken(6)
            const path = r.multiTokenPattern("(", ";", [")"]).join()
            console.log(ptr, path)
            ptrMap.set(ptr, path)
        }
    },
    front: function (r: Reader): void {
        if (r.checkToken(";")){
            // because I don't read the special stuff for now
            r.deactivateStateUntilTrans()
            return
        }
        if (r.checkToken("SPECIES_SPRITE")){
            const specie = "SPECIES_" + r.getToken(2)
            const ptr = r.getToken(2)
            const path = ptrMap.get(ptr) || ""
            r.deactivateStateUntilTrans()
        }
    },
    back: function (r: Reader): void {
        if (r.checkToken(";")){
            // because I don't read the special stuff for now
            r.deactivateStateUntilTrans()
            return
        }
        if (r.checkToken("SPECIES_SPRITE")){
            const specie = "SPECIES_" + r.getToken(2)
            const ptr = r.getToken(2)
            const path = ptrMap.get(ptr) || ""
            console.log(specie, ptr, path)
            r.deactivateStateUntilTrans()
        }
    },
    pal: function (r: Reader): void {
        if (r.checkToken(";")){
            // because I don't read the special stuff for now
            r.deactivateStateUntilTrans()
            return
        }
        if (r.checkToken("SPECIES_PAL")){
            const specie = "SPECIES_" + r.getToken(2)
            const ptr = r.getToken(2)
            const path = ptrMap.get(ptr) || ""
            console.log(specie, ptr, path)
            console.log()
            r.deactivateStateUntilTrans()
        }
    },
    shinyPal: function (r: Reader): void {
        if (r.checkToken(";")){
            // because I don't read the special stuff for now
            r.deactivateStateUntilTrans()
            return
        }
        if (r.checkToken("SPECIES_SHINY_PAL")){
            const specie = "SPECIES_" + r.getToken(2)
            const ptr = r.getToken(2)
            const path = ptrMap.get(ptr) || ""
            console.log(specie, ptr, path)
            r.deactivateStateUntilTrans()
        }
    }
}

const listOfFiles: NestedString = [
    "src/data/graphics/pokemon.h",
    "src/data/pokemon_graphics/front_pic_table.h",
    "src/data/pokemon_graphics/back_pic_table.h",
    "src/data/pokemon_graphics/palette_table.h",
    "src/data/pokemon_graphics/shiny_palette_table.h"
] as const


const cInject = `

`
const filesSeparator = "__END_OF_FILE__"

const TransitionsMap: Record<TemplateState, [string, TemplateState] | [string]>= {
    pokemon: [filesSeparator, "front"],
    front: [filesSeparator, "back"],
    back: [filesSeparator, "pal"],
    pal: [filesSeparator, "shinyPal"],
    shinyPal: [filesSeparator]
}

export function getER21Sprites(precursor: PProcessorData, finalCb: (data: spritesData)=>void){
    cPreprocessFileNest2(extendNestedFilePathWithProjectPath(listOfFiles, projectPath), precursor, cInject, filesSeparator)
    .then((fileData)=>{
        const data = reader(fileData.str)
        
        finalCb(data)
    })
    .catch((err)=>{
        logError("ER2.1 getting species err: " + err)
    })

}

function reader(fileData: string){
    const reader = new TokenReader<TemplateState, spritesData>({
        tokens: tokenize(fileData),
        stateRec: XStateMap,
        startState: "pokemon",
        data: new Map<string, SpecieSpriteData>(),
        transRec: TransitionsMap,
        name: "species - er2.1",
    })
    const data = reader.start()
    return data
}

