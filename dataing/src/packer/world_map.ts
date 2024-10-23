import { WorldMap } from "../grabber/world_map/world_map"

export type CompactEncounterFieldVanilla = {
    encounters_rate: number,
    mons: {
        min_level: number, 
        max_level: number,
         specie:number
    }[]
}

export interface CompactObjectEventVanilla{
    graphics_id: string,
    x: number,
    y: number,
    ttype: string,
    sight: number,
    script: string
}


//map groups exist but I'll ignore them
export interface CompactWorldMapVanilla{
    name: string,
    /*dims: {
        w: number,
        h: number
    },*/
    encounters: (CompactEncounterFieldVanilla | undefined)[],
    //objsEv: CompactObjectEventVanilla[],
}

export type CompactWorldMap = CompactWorldMapVanilla

export function compactWorldMaps(worldMaps: WorldMap[], encounterFields: string[], speciesT: string[]){
    const data = worldMaps.map(worldMap => {
        const CompactWorldMap: CompactWorldMap = {
            name: worldMap.id.replace('MAP_', ''),
            encounters: encounterFields.map(x => {
                const field = worldMap.encounters.get(x)
                if (!field)
                    return undefined
                return {
                    encounters_rate: field.encounters_rate,
                    mons: field.mons.map(mon => {
                        return {
                            min_level: mon.min_level,
                            max_level: mon.max_level,
                            specie: speciesT.indexOf(mon.specie)
                        }
                    })
                }
            }).filter(x => x)
        }
        return CompactWorldMap
    })
    verifyData(data)
    return data
}

function verifyData(data: CompactWorldMap[]){
    if (!data.length)
        throw "No World Map was packed"
}