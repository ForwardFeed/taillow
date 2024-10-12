import { cPreprocessFileNest2, initPProcessorData, PProcessorData } from "../preprocessor";
import { chosenConfig, fullConfig, PartConfig } from "../config_handler";
import { exportData } from "../export_data";
import { logError, logInform } from "../logging";
import { getER21Moves } from "./moves/er21";
import { getVanillaMoves } from "./moves/vanilla";
import { getER21Species } from "./species/er21";
import { getVanillaSpecies } from "./species/vanilla";
import { extendNestedFilePathWithProjectPath } from "../parse_utils";
import { VersionsAvailable } from "../../config"
import { postGrabER21Species } from "./postprocessing/er21";
import { GameData21, initGameData21 } from "./types.ts/er21";
import { packER21 } from "../packer/er21";

class CallbackTracker<T>{
    n: number;
    nbCall: number;
    sharedObject: T;
    finalCb: (t: T)=>void
    constructor(nbCall: number, sharedObject: T, finalCb: (t: T)=>void){
        this.n = 0
        this.nbCall = nbCall
        this.sharedObject = sharedObject
        this.finalCb = finalCb
    }
    finished(){
        if (this.n >= this.nbCall)
            throw "called finished more than expected"
        if (++this.n >= this.nbCall){
            this.finalCb(this.sharedObject)
        }
    }
}

export function grab(){
    cPreprocessFileNest2(extendNestedFilePathWithProjectPath(chosenConfig.precursor,chosenConfig.folder), initPProcessorData())
        .then((precursor)=>{
            logInform("Finished read precursor")
            grabMab[fullConfig.active](precursor)
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
        const tracker = new CallbackTracker(1, initGameData21(), (gameData)=>{
            exportData(packER21(gameData))
        })
            
        /*getER21Moves(precursor, (data)=>{
           
            logInform("finished to grab er21 moves")
        })*/
        getER21Species(precursor, (data)=>{
            tracker.sharedObject.species = postGrabER21Species(data)
            logInform("finished to grab er21 species")
        })
    }
}