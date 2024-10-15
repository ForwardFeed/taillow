import { ErSpecieData } from "../species/types";



// needs to have specific orders
// for example if I delete a specie because X
// then I would need to delete all its references
// but sometimes It's better to delete all its references first

export function postGrabER21Species(species: Map<string, ErSpecieData>){
    species.forEach((val, key, species)=>{
        if (val.baseStats.spe == 0){
            species.delete(key)
        }
        val.name = nameModification(val.NAME, val.name)
    })
    return species
}

function nameModification(NAME: string, name: string): string{
    if (NAME.includes('MEGA')){
        return name + " " + NAME.match(/MEGA.*/)?.[0].replace('_', ' ').toLowerCase() || ""
    }
    return name
}

const modifications: {[key: string]: Partial<ErSpecieData>} = {
    "SPECIES_A": {
        name: "charizard-y"
    }
}