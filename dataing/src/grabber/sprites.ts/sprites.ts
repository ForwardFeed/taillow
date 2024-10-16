import { parameters } from "../../cli_args"
import { chosenConfig } from "../../config_handler"
import { exportSprites } from "../../exporter/sprites"
import { PProcessorData } from "../../extractor/preprocessor"
import { getER21Sprites } from "./er21.ts"

export type SpecieSpriteData = {
    specie: string,
    front: string,
    back: string,
    pal: string,
    shinyPal: string,
}

export function grabSprites(precursor: PProcessorData){
    getER21Sprites(precursor, (spritesData)=>{
        console.log(spritesData)
        const spritesDataArray: SpecieSpriteData[] = []
        spritesData.forEach((val, key)=>{
            spritesDataArray.push({
                specie: val.specie,
                front: val.front,
                back: val.back,
                pal: val.pal,
                shinyPal: val.shinyPal,
            })
        })
        exportSprites(spritesDataArray, chosenConfig.folder, parameters.export)
    })
}