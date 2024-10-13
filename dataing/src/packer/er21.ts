import { AbilityData } from "../grabber/abilities.ts/types";
import { ErSpecieData } from "../grabber/species/types";
import { GameData21 } from "../grabber/types.ts/er21";
import { CompactGamedata, CompactSpecies } from "./types";

export interface ER21CompactSpecies extends CompactSpecies{
    innates: number[]
}

export interface ER21CompactGamedata extends CompactGamedata<ER21CompactSpecies>{
    
}
export function packER21(gamedata: GameData21): ER21CompactGamedata{
    const abilities  = [] as AbilityData[]
    const abilitiesT = [] as string[]
    gamedata.abilities.forEach((abi, NAME)=>{
        abilitiesT.push(NAME)
        abilities.push({
            name: abi.name,
            desc: abi.desc,
            internalID: abi.internalID
        })
    })
    const species   = [] as ER21CompactSpecies[]
    gamedata.species.forEach((specie, NAME) => {
        const CS: Required<ER21CompactSpecies> = {
            NAME: NAME,
            name: specie.name,
            abilities: specie.abilities?.map(x => abilitiesT.indexOf(x)) || [],
            innates: specie.innates?.map(x => abilitiesT.indexOf(x)) || [],
        }   
    })
    const compacted: ER21CompactGamedata = {
        species: species,
        abilities: abilities
    }
    return compacted
}