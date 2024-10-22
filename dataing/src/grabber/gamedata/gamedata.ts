import { Ability } from "../abilities/ability"
import { Move } from "../moves/move"
import { Specie } from "../species/specie"
import { Trainer } from "../trainers/trainers"
import { WorldMap } from "../world_map/world_map"


export interface GameData {
    species: Map<string, Specie>
    abilities: Map<string, Ability>
    trainers: Map<string, Trainer>
    moves: Map<string, Move>
    worldMaps: {worldMapData: WorldMap[], encounterFields: string[] },
    types: string[]
    items: string[]
    natures: string[]
}
