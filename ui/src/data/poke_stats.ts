import type { CompactGameData } from "@/stores/gamedata_type"

export const STATS_LIST = ["HP", "ATK", "DEF", "SPA", "SPD", "SPE", "BST"]
export const stats_list = ["H.P.", "Attack", "Defense", "Spe. Attack", "Spe. Defense", "Speed", "BaseStats Total"]

const LEN_STATS_NO_BST = 6
/**
 * Generate the ranking of all stats of all species
 */
export function buildStatPercentile(gamedata: CompactGameData){
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dataCum = new Array(LEN_STATS_NO_BST).fill(0).map(_x => []) as number[][]
    gamedata.species.map((specie) => {
        for (let i = 0; i < LEN_STATS_NO_BST; i++){
            dataCum[i].push(specie.baseStats[i])
        }
    })
    const sortedDataCum = dataCum.map(x => x.sort())
    const speciesLen = gamedata.species.length
    gamedata.b_species_stats = gamedata.species.map(specie => {
        return specie.baseStats.map((x, i) => (sortedDataCum[i].indexOf(x) / speciesLen) * 100)
    })
    console.log(gamedata.b_species_stats, sortedDataCum)
}