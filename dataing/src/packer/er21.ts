import { Ability } from "../grabber/abilities/ability";
import { SpecieER21 } from "../grabber/species/specie";
import { CompactGamedata, CompactMove, CompactSpecie, CompactTrainer } from "./vanilla";
import { MoveER21 } from "../grabber/moves/move";
import { GameData } from "../grabber/gamedata/gamedata";

export interface ER21CompactSpecies extends CompactSpecie{
    innates: number[]
}

export interface ER21CompactGamedata extends CompactGamedata{
    
}
export function packER21(gamedata: GameData): ER21CompactGamedata{
    const abilities  = [] as Ability[]
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
        const CS: ER21CompactSpecies = {
            NAME: NAME,
            name: specie.name,
            abilities: specie.abilities?.map(x => abilitiesT.indexOf(x)) || [],
            innates: specie.innates?.map(x => abilitiesT.indexOf(x)) || [],
        }   
    })
    const compacted: ER21CompactGamedata = {
        species: species,
        abilities: abilities,
        trainers: [],
        moves: [],
        types: [],
        items: [],
        natures: [],
        trainerClass: [],
        trainerPic: [],
        trainerAIs: []
    }
    return compacted
}