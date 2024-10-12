import { AbilityData } from "../grabber/abilities.ts/types";
import { GameData21 } from "../grabber/types.ts/er21";
import { CompactGameData, CompactSpecies, Indexed } from "./compact_gamedata";

export interface ER21CompactSpecies extends CompactSpecies{
    innates: Indexed[]
}

export interface ER21CompactGameData extends CompactGameData<ER21CompactSpecies>{
    
}
export function packER21(gamedata: GameData21): ER21CompactGameData{
    const abilities  = [] as AbilityData[]
    const abilitiesT = [] as string[]
    gamedata.abilities.forEach((abi, NAME)=>{
        abilitiesT.push(NAME)
        abilities.push({
            name: abi.name,
            desc: abi.desc
        })
    })
    const species   = [] as ER21CompactSpecies[]
    gamedata.species.forEach((specie, NAME) => {
        species.push({
            abilities: specie.abilities.map(x => abilitiesT.indexOf(x)),
            innates: specie.innates.map(x => abilitiesT.indexOf(x))
        })
    })
    const compacted: ER21CompactGameData = {
        species: species
    }
    return compacted
}