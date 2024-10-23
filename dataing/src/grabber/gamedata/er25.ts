import { GameData } from "./gamedata"


export function initGameData21(): GameData{
    const gaemdata: GameData = {
        species: new Map(),
        abilities: new Map(),
        trainers: new Map(),
        moves: new Map(),
        worldMaps: {
            worldMapData: [],
            encounterFields: []
        },

        types: [],
        natures: [],
        items: []
    }
    return gaemdata
}
