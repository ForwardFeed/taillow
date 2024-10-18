import { cPreprocessFileNest2, initPProcessorData, PProcessorData } from "../extractor/preprocessor";
import { chosenConfig, fullConfig, PartConfig } from "../config_handler";
import { WriteGamedataJson, writeGamedataGzip} from "../exporter/write_gamedata";
import { logError, logInform } from "../logging";
import { getER21Moves } from "./moves/er21";
import { getVanillaMoves } from "./moves/vanilla";
import { getER21Species } from "./species/er21";
import { getVanillaSpecies } from "./species/vanilla";
import { extendNestedFilePathWithProjectPath } from "../extractor/parse_utils";
import { VersionsAvailable } from "../../config"
import { postGrabER21Species } from "./postgrab/er21";
import { GameData21, initGameData21 } from "./gamedata/er21";
import { packER21 } from "../packer/er21";
import { getER21Abilities } from "./abilities/er21";
import { editVersion } from "../exporter/edit_version";
import { parameters } from "../cli_args";
import { grabSprites } from "./sprites.ts/sprites";
import { getER21Trainers } from "./trainers/er21";
import { getER21NaturesTypes } from "./misc/er21";

type CallGrab<T> = {
    fn: (precursor: PProcessorData, cb: (any: any)=>void)=>void,
    field: ((t: T, any: any)=>void) | keyof T ,
    endMsg: string,
}

class CallbackTracker<T>{
    precursor: PProcessorData;
    n: number;
    sharedObject: T;
    finalCb: (t: T)=>void;
    callsGrabs: CallGrab<T>[];
    constructor(sharedObject: T, finalCb: (t: T)=>void, callsGrabs: CallGrab<T>[], precursor: PProcessorData){
        this.n = 0
        this.sharedObject = sharedObject
        this.finalCb = finalCb
        this.callsGrabs = callsGrabs
        this.precursor = precursor
    }
    start(){
        if (this.n >= this.callsGrabs.length)
            throw "CallBackTracker cannot be run twice without being destroyed in between"
        for (const callGrab of this.callsGrabs){
            callGrab.fn(structuredClone(this.precursor), (data)=>{
                if (typeof callGrab.field === "function"){
                    callGrab.field(this.sharedObject, data)
                } else {
                    this.sharedObject[callGrab.field] = data
                }
                this.finished()
            })
        }
    }
    finished(inform?: string){
        if (inform){
            logInform(inform)
        }
        if (this.n >= this.callsGrabs.length)
            throw "called finished more than expected"
        if (++this.n >= this.callsGrabs.length){
            try{
                this.finalCb(this.sharedObject)
            } catch(err){
                logError("error in final CB in callback tracker" + err + "")
            }
            
        }
    }
}

export function grabGameData(){
    cPreprocessFileNest2(extendNestedFilePathWithProjectPath(chosenConfig.precursor,chosenConfig.folder), initPProcessorData())
        .then((precursor)=>{
            logInform("Finished read precursor")
            grabMab[fullConfig.active](precursor)
            editVersion()
        })
        .catch((err)=>{
            logError("Failure while preprocessign precursor:" + err)
        })
}

const grabMab: Record<VersionsAvailable, (precursor: PProcessorData)=>void> = {
    vanilla: function (precursor: PProcessorData): void {
        /*getVanillaSpecies(precursor, (data)=>{
            exportData(data)
            logInform("finished to grab vanilla species")
        })
        getVanillaMoves(precursor, (data)=>{
            logInform("finished to grab vanilla moves")
        })*/
    },
    "ER2.1": function (precursor: PProcessorData): void {
        if (parameters.spritesOnly){
            grabSprites(precursor)
            return
        }
        new CallbackTracker(initGameData21(), (gamedata)=>{
            logInform("Exporting data")
            //exportGameData(packER21(gamedata))
            writeGamedataGzip(packER21(gamedata))
        }, [
            /*{
                fn: getER21Abilities,
                field: "abilities",
                endMsg: "finished to grab er21 abilities"
            },
            {
                fn: getER21Species,
                field: "species",
                endMsg: "finished to grab er21 species"
            },*/
            {
                fn: getER21Trainers,
                field: "trainers",
                endMsg: "finished to grab er21 trainers"
            },
            {
                fn: getER21NaturesTypes,
                field: (gamedata, any)=>{
                    gamedata.natures = any.natures,
                    gamedata.types = any.types
                },
                endMsg: "finished to grab er21 Natures & types"
            }
        ], precursor).start()
        /*getER21Moves(precursor, (data)=>{
           
            logInform("finished to grab er21 moves")
        })*/
        /*getER21Abilities(structuredClone(precursor), (data)=>{
            tracker.sharedObject.abilities = data
            tracker.finished("finished to grab er21 abilities")
        })
        getER21Species(structuredClone(precursor), (data)=>{
            tracker.sharedObject.species = postGrabER21Species(data)
            tracker.finished("finished to grab er21 species")
        })*/
    }
}