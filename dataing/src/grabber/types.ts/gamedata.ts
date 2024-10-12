import { AbilityData } from "../abilities.ts/types"
import { SpecieData } from "../species/types"

export interface GameData<Species extends SpecieData, Abilities extends AbilityData> {
    species: Map<string, Species>
    abilities: Map<string, Abilities>
}