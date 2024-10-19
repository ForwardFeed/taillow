import { Ability } from "../abilities/ability"
import { MoveER21 } from "../moves/move"
import { SpecieER21 } from "../species/specie"
import { GameData } from "./gamedata"


export function initGameData21(): GameData{
    const gaemdata: GameData = {
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
