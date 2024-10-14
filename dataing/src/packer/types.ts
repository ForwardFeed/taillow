import { AbilityData } from "../grabber/abilities.ts/types"

export interface CompactSpecies{
    abilities: number[]
    name: string,
    NAME: string,
}

export interface CompactGamedata<Species extends CompactSpecies>{
    species: Species[]
    abilities: AbilityData[]
}
