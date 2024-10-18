import { AbilityData } from "../abilities/types"
import { ER21Move } from "../moves/types"
import { ErSpecieData } from "../species/types"
import { GameData } from "./gamedata"


export interface GameData21 extends GameData<ErSpecieData, AbilityData, ER21Move> {
    species:  Map<string, ErSpecieData>
}

export function initGameData21(): GameData21{
    const gaemdata: GameData21 = {
        species: new Map(),
        abilities: new Map(),
        trainers: new Map(),
        moves: new Map(),
        
        types: [],
        natures: [],
        items: []
    }
    return gaemdata
}
