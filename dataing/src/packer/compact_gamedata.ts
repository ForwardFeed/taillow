import { AbilityData } from "../grabber/abilities.ts/types"

// ease the reading
export type Indexed = number

export interface CompactSpecies{
    abilities: Indexed[]
    name: string,
    NAME: string,
}

export interface CompactGameData<Species extends CompactSpecies>{
    species: Species[]
    abilities: AbilityData[]
}