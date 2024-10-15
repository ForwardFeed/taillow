import { parameters } from "../../cli_args"
import { PProcessorData } from "../../extractor/preprocessor"
import { getER21Sprites } from "./er21.ts"

export type SpecieSpriteData = {
    front: string,
    back: string,
    pal: string,
    shinyPal: string,
}

export function grabSprites(precursor: PProcessorData){
    getER21Sprites(precursor, (spritesData)=>{
        console.log(spritesData)
    })
}