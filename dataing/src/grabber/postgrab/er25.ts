import { SpecieER25 } from "../species/specie";


export function postGrabER25Species(species: Map<string, SpecieER25>){
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

const modifications: {[key: string]: Partial<SpecieER25>} = {
    "SPECIES_A": {
        name: "charizard-y"
    }
}