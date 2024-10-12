import { AbilityData } from "../abilities.ts/types"
import { ErSpecieData } from "../species/types"
import { GameData } from "./gamedata"


export interface GameData21 extends GameData<ErSpecieData, AbilityData> {
    species:  Map<string, ErSpecieData>
}

export function initGameData21(): GameData21{
    const gaemdata: GameData21 = {
        species: new Map(),
        abilities: new Map()
    }
    return gaemdata
}