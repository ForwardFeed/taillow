import { AbilityData } from "../grabber/abilities/types"

export interface CompactSpecies{
    abilities: number[]
    name: string,
    NAME: string,
}

export interface CompactGamedata<Species extends CompactSpecies>{
    species: Species[]
    abilities: AbilityData[]
}
