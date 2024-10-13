import { ER21CompactGamedata } from "./er21";

import { AbilityData } from "../grabber/abilities.ts/types"
import { CompactGameDataVanilla } from "./vanilla";

export interface CompactSpecies{
    abilities: number[]
    name: string,
    NAME: string,
}

export interface CompactGamedata<Species extends CompactSpecies>{
    species: Species[]
    abilities: AbilityData[]
}
