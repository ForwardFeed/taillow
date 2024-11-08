import type { CompactGameData } from "@/stores/gamedata_type";
import { buildStatPercentile } from "./poke_stats";
import { buildSpeciesPerAbilities } from "./abilities_stats";


/**
 * Althought I could ship that on the server end
 * I thought that building this data client side after gamedata 
 * was generaly a good idea
 */
export function buildClientGeneratedData(gamedata: CompactGameData){
    buildStatPercentile(gamedata)
    buildSpeciesPerAbilities(gamedata)
}

