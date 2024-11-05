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
    // adding BST
    dataCum[LEN_STATS_NO_BST] = []
    const BST_SPECIES: number[] = []
    gamedata.species.map((specie) => {
        let BST = 0
        for (let i = 0; i < LEN_STATS_NO_BST; i++){
            const stat = specie.baseStats[i]
            dataCum[i].push(stat)
            BST += stat
        }
        // adding BST
        BST_SPECIES.push(BST)
        dataCum[LEN_STATS_NO_BST].push(BST)
    })
    const sortedDataCum = dataCum.map(x => x.sort(function(a, b){return a - b}))
    const speciesLen = gamedata.species.length
    gamedata.species.forEach((specie, specieIndex) => {
        specie.b_species_stats = specie.baseStats.concat(BST_SPECIES[specieIndex]).map((x, i) => (sortedDataCum[i].indexOf(x) / speciesLen) * 100)
    })
}

// https://www.w3.org/TR/2000/WD-AERT-20000426#color-contrast
function getLuminance(red: number, green: number, blue: number){
    return ((red * 299) + (green * 587) + (blue * 114)) / 1000
}

/**
 * How gradients are calcultated
 * R => 255 | 0  - 20
 * G => 255 | 20 - 40
 * R => 0   | 40 - 60
 * B => 255 | 60 - 80
 * G => 0   | 80 - 100
 */
type ColorTranslationTable = ((stat: number)=> number )
type CTT5 = [ColorTranslationTable, ColorTranslationTable, ColorTranslationTable, ColorTranslationTable ,ColorTranslationTable]

function upgradeColor(offset: number, stat: number): number{
    return Math.round(((stat  - offset) / 20 ) * 255) 
}

function downgradeColor(offset: number, stat: number): number{
    return Math.round(255 - ((stat - offset) / 20) * 255)
}

const redTranslation: CTT5 = [
    function(stat: number){
        return upgradeColor(0, stat)
    },
    function(){return 255},
    function(stat: number){
        return downgradeColor(40, stat)
    },
    function(){return 0},
    function(){return 0}
] as const
const greenTranslation: CTT5 = [
    function(){return 0},
    function(stat: number){
        return upgradeColor(20, stat)
    },
    function(){return 255},
    function(){return 255},
    function(stat: number){
        return downgradeColor(80, stat)
    }
] as const
const blueTranslation: CTT5 = [
    function(){return 0},
    function(){return 0},
    function(){return 0},
    function(stat: number){
        return upgradeColor(60, stat)
    },
    function(){return 255},
] as const
export function generateColorOfStatsPercent(stat: number): string{
    
    const percentRange = Math.floor(stat / 20)

    const red = redTranslation[percentRange](stat)
    const green = greenTranslation[percentRange](stat)
    const blue = blueTranslation[percentRange](stat)
    return `background-color: rgb(${red}, ${green}, ${blue}); color: ${getLuminance(red, green, blue) > 125 ? '#000' : '#fff'};`
}
