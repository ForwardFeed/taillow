import { AbilityData } from "../abilities/types"
import { SpecieData } from "../species/types"
import { TrainerData } from "../trainers/trainers"

export interface GameData<Species extends SpecieData, Abilities extends AbilityData> {
    species: Map<string, Species>
    abilities: Map<string, Abilities>
    trainers: Map<string, TrainerData>
}