import type { CompactGameData } from "@/stores/gamedata_type";


export function buildSpeciesPerAbilities(gamedata: CompactGameData){

    gamedata.species.forEach((specie, specieIndex)=>{
        specie.abilities.forEach((abiIndex)=>{
            if (!gamedata.abilities[abiIndex].b_species)
                gamedata.abilities[abiIndex].b_species = []
            // no duplicate
            if (~gamedata.abilities[abiIndex].b_species.indexOf(specieIndex))
                return
            gamedata.abilities[abiIndex].b_species.push(specieIndex)
        })
        specie.innates.forEach((abiIndex)=>{
            if (!gamedata.abilities[abiIndex].b_species)
                gamedata.abilities[abiIndex].b_species = []
            // no duplicate
            if (~gamedata.abilities[abiIndex].b_species.indexOf(specieIndex))
                return
            gamedata.abilities[abiIndex].b_species.push(specieIndex)
        })
    })
}