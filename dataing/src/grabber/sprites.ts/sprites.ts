import { chosenConfig } from "../../config_handler"
import { exportSprites } from "../../exporter/sprites"
import { PProcessorData } from "../../extractor/preprocessor"
import { logInform, logPerf } from "../../logging"
import { getER25Sprites } from "./er25.ts"

export type SpecieSpriteData = {
    specie: string,
    front: string,
    back: string,
    pal: string,
    shinyPal: string,
}

export function grabSprites(precursor: PProcessorData){
    getER25Sprites(precursor, (spritesData)=>{
        const spritesDataArray: SpecieSpriteData[] = []
        spritesData.forEach((val)=>{
            spritesDataArray.push({
                specie: val.specie,
                front: val.front,
                back: val.back,
                pal: val.pal,
                shinyPal: val.shinyPal,
            })
        })
        logInform(`exporting ${ spritesDataArray.length} pokemon sprites\
so ${spritesDataArray.length * 4} sprites`)
        exportSprites(spritesDataArray, chosenConfig.folder)
    })
}