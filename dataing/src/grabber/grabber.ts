import { cPreprocessFileNest2, initPProcessorData, PProcessorData } from "../c_parser/preprocessor";
import { chosenConfig, fullConfig, PartConfig } from "../config";
import { exportData } from "../export_data";
import { logError, logInform } from "../logging";
import { getER21Moves } from "./moves/er21";
import { getVanillaMoves } from "./moves/vanilla";
import { getER21Species } from "./species/er21";
import { getVanillaSpecies } from "./species/vanilla";


export function grab(){
    if (!fullConfig){
        return logError("Please initialize the config before running")
    }
    if (!chosenConfig){
        return logError("Please initialize the config before running or select a configuration")
    }
    
    cPreprocessFileNest2(chosenConfig.precursor, initPProcessorData())
        .then((precursor)=>{
            if (!fullConfig){
                return logError("Please initialize the config before running")
            }
            if (!chosenConfig){
                return logError("Please initialize the config before running or select a configuration")
            }
            logInform("Finished read precursor")
            if (fullConfig.active == "vanilla"){
                vanilla(precursor)
            } else if (fullConfig.active == "ER2.1"){
                er21(precursor)
            }
        })
        .catch((err)=>{
            logError("Failure while preprocessign precursor:" + err)
        })
}

function vanilla(precursor: PProcessorData){
    getVanillaSpecies(precursor, (data)=>{
        exportData(data)
        logInform("finished to grab vanilla species")
    })
    
    /*getVanillaMoves(precursor, (data)=>{
        exportData(data)
        logInform("finished to grab vanilla moves")
    })*/
}

function er21(precursor: PProcessorData){
    /*getER21Species(precursor, (data)=>{
        exportData(data)
        logInform("finished to grab er21 species")
    })*/
    getER21Moves(precursor, (data)=>{
        exportData(data)
        logInform("finished to grab er21 moves")
    })
}