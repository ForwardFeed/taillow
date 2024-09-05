import { ErSpecieData } from "../grabber/species/types";

function patchER21Species(species: Map<string, ErSpecieData>){
    species.forEach((val, key, species)=>{
        if (val.baseStats.spe == 0){
            species.delete(key)
        }
    })
}