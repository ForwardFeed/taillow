
export type EncounterField = {
    encounters_rate: number,
    mons: [{
        min_level: number,
        max_level: number,
        specie: string
    }]
}

export interface ObjectEventVanilla{
    graphics_id: string,
    x: number,
    y: number,
    ttype: string,
    sight: number,
    script: string
}

//map groups exist but I'll ignore them
export interface WorldMapVanilla{
    id: string,
    dims: {
        w: number,
        h: number
    },
    encounters: Map<string, EncounterField>,
    objsEv: ObjectEventVanilla[],
}

export interface ObjectEventER25 extends ObjectEventVanilla{

}

export interface WorldMapER25 extends WorldMapVanilla{
    
}



export type WorldMap = WorldMapVanilla & Partial<WorldMapER25>