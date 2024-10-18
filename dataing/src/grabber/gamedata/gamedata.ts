import { AbilityData } from "../abilities/types"
import { VanillaMoveData } from "../moves/types"
import { SpecieData } from "../species/types"
import { TrainerData } from "../trainers/trainers"

export interface GameData<Specie extends SpecieData, Ability extends AbilityData, Move extends VanillaMoveData> {
    species: Map<string, Specie>
    abilities: Map<string, Ability>
    trainers: Map<string, TrainerData>
    moves: Map<string, Move>

    types: string[]
    items: string[]
    natures: string[]
}