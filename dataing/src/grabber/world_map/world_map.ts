// encounters src/data/encounters.json
// data/maps/map_groups.json

export interface ObjectEventVanilla{
    id: string,
    x: number,
    y: number,
    ttype: string,
    sight: number,
    script: string
}

export interface WorldMapVanilla{
    //map groups exist but I'll ignore them
    NAME: string,
    name: string,
    //allow_cycling: boolean,
    //allow_escaping: boolean,
    //allow_running: boolean,
    object_events: ObjectEventVanilla[],
}

export interface ObjectEventER21 extends ObjectEventVanilla{

}

export interface WorldMapER21 extends WorldMapVanilla{
    
}



export type WorldMap = WorldMapVanilla & Partial<WorldMapER21>