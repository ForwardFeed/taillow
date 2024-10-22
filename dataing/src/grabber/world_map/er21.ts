import { join } from "path";
import { chosenConfig } from "../../config_handler";
import { readFile } from "fs/promises";
import { logError } from "../../logging";
import { EncounterField, ObjectEventVanilla, WorldMap } from "./world_map";


export type RateFields = Record<string, number[]>

function getRateFields(fields: any){
    const obj: RateFields = {}
    for (const field of fields){
        obj[field["type"]] = structuredClone(field["encounter_rates"])
    }
    return obj
}



export type EncounterMapData =  Map<string, EncounterField>

function getAllMapsEncounters(maps: any, fieldsNames: string[]):Map<string, EncounterMapData> {
    const mapsData: Map<string, EncounterMapData> = new Map()
    for (const map of maps){
        const mapfields: Map<string, EncounterField> = new Map()
        for (const fieldName of fieldsNames){
            const field = map[fieldName]
            if (!field)
                continue
            const monData: EncounterField = {
                encounters_rate: field["encounter_rate"],
                mons: field["mons"].map((x: { [x: string]: any; }) => {
                    return {
                        min_level: x["min_level"],
                        max_level: x["max_level"],
                        specie: x["species"],
                    }
                })
            }
            mapfields.set(fieldName, monData)
        }
        mapsData.set(map["map"], mapfields)
    }
    return mapsData
}

function parseEncountersJson(jsondata: any) {
    const dataArray = jsondata["wild_encounter_groups"]
    let encounterFields: string[] = []
    const mapsData: Map<string, EncounterMapData> = new Map()
    for (const data of dataArray){
        if (data["label"] === "gWildMonHeaders"){
            const ratefields = getRateFields(data["fields"])
            encounterFields = Object.keys(ratefields)
            getAllMapsEncounters(data["encounters"], encounterFields).forEach((val, key)=>{
                mapsData.set(key, structuredClone(val))
            })
        } else if (data["label"] === "gBerryTreeWildMonHeaders"){
            getAllMapsEncounters(data["encounters"], encounterFields).forEach((val, key)=>{
                mapsData.set(key, structuredClone(val))
            })
        } else {
            
        }
        
    }
    return {
        encounterFields: encounterFields,
        mapsData: mapsData
    }
}


function parseMapGroups(json: any): string[]{
    const allMapsName: string[] = []
    const groups = json["group_order"] as string[]
    for (const mapgroup of groups){
        allMapsName.push(...json[mapgroup])
    }
    return allMapsName
}

export type LayoutData = {
    name: string,
    width: number,
    height: number,
    primary: string,
    secondary: string,
    border: string,
    data: string
}

function parseLayout(json: any) :Map<string, LayoutData>{
    const layoutMap = new Map()
    json["layouts"].forEach((x: { id: any; name: any; width: any; height: any; primary_tileset: any;
secondary_tileset: any; border_filepath: any; blockdata_filepath: any; }) => {
        const layout: LayoutData = {
            name: x.name,
            width: x.width,
            height: x.height,
            primary: x.primary_tileset,
            secondary: x.secondary_tileset,
            border: x.border_filepath,
            data: x.blockdata_filepath,
        }
        layoutMap.set(x.id, layout)
    })
    return layoutMap
}


export function getWorldMapER21(_precursor: any, finalCb: (any: {worldMapData: WorldMap[], encounterFields: string[] })=>void){
    const mapsPath       = join(chosenConfig.folder, "data/maps/map_groups.json")
    const layoutPath     = join(chosenConfig.folder, "data/layouts/layouts.json")
    const encountersPath = join(chosenConfig.folder, "src/data/wild_encounters.json")
    let mapsData: string[]
    let layoutData: Map<string, LayoutData>
    let encountersData: {
        encounterFields: string[];
        mapsData: Map<string, EncounterMapData>;
    }
    Promise.all([
        new Promise<void>((resolve, reject)=>{
            readFile(mapsPath, "utf-8")
                .then((filedata: string)=>{
                    const json = JSON.parse(filedata)
                    mapsData = parseMapGroups(json)
                    resolve()
                })
                .catch((err)=>{
                    reject(err)
                })
        }),
        new Promise<void>((resolve, reject)=>{
            readFile(layoutPath, "utf-8")
                .then((filedata: string)=>{
                    const json = JSON.parse(filedata)
                    layoutData = parseLayout(json)
                    resolve()
                })
                .catch((err)=>{
                    reject(err)
                })
        }),
        new Promise<void>((resolve, reject)=>{
            readFile(encountersPath, "utf-8")
                .then((filedata: string)=>{
                    const json = JSON.parse(filedata)
                    encountersData = parseEncountersJson(json)
                    resolve()
                })
                .catch((err)=>{
                    reject(err)
                })
        }),
    ])
    .then(()=>{
        Promise.all(mapsData.map(x => 
            readFile(join(chosenConfig.folder, "data/maps/", x, "map.json"), "utf-8")
        ))
        .then((vals)=>{
            finalCb( {
                worldMapData: vals.map(val => {
                const mapJson =  JSON.parse(val)
                const mapID = mapJson["id"]
                const objsEvent = mapJson["object_events"]
                const layout = layoutData.get(mapJson["layout"])
                const encs = encountersData.mapsData.get(mapID) || new Map()
                
                const worldMapData: WorldMap = {
                    id: mapID,
                    dims: {
                        w: layout?.width || -1,
                        h: layout?.height || -1
                    },
                    encounters: encs,
                    objsEv: objsEvent?.map((x: { [x: string]: any; }) => {
                        const a: ObjectEventVanilla = {
                            graphics_id: x["graphics_id"],
                            x: x["x"],
                            y: x["y"],
                            script: x["script"],
                            ttype: x["trainer_type"],
                            sight: +x["trainer_sight_or_berry_tree_id"]
                        }
                        return a
                    })
                }
                return worldMapData
            }) ,
            encounterFields: encountersData.encounterFields
        })
        })
        
    })
    .catch((err)=>{
        logError("in getting world Map data" + err)
    })
}