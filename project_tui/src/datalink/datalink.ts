import { FullPokeData, Specie, Ability } from "dataing/src/c_parser/types";
import { Datalink, FullDatalinked } from "./types";



function nameToConstant(name: string): string{
    // replace whitespaces by underscore
    let treatedName = name.replace(/\s+/g, '_') 
     // remove all invalid for a constant name
    treatedName = treatedName.replace(/[^A-Za-z0-9_]/g, '')
    treatedName = treatedName.toUpperCase()
    if (!treatedName){
        throw `Invalid nameing ${name}`
    }
    return treatedName
}

export function createDatalink(pokeData: FullPokeData): FullDatalinked{

    const datalink: FullDatalinked = {
        
        species: pokeData.species.map(specie => {
            return {
                constant: nameToConstant(specie.name),
                id: specie.id
            } as Datalink
        }),

        abilities: pokeData.abilities.map(ability => {
            return {
                constant: nameToConstant(ability.name),
                id: ability.id
            } as Datalink
        }),

    }
    return datalink
}