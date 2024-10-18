import { AbilityData } from "../abilities/types"
import { MoveData } from "../moves/types"
import { SpecieData } from "../species/types"
import { TrainerData } from "../trainers/trainers"

export interface GameData<Specie extends SpecieData, Ability extends AbilityData, Move extends MoveData> {
    species: Map<string, Specie>
    abilities: Map<string, Ability>
    trainers: Map<string, TrainerData>
    moves: Map<string, Move>

    types: string[]
    items: string[]
    natures: string[]
}