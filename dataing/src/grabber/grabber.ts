import { cPreprocessFileNest2, initPProcessorData, PProcessorData } from "../preprocessor";
import { chosenConfig, fullConfig, PartConfig } from "../config_handler";
import { exportData } from "../export_data";
import { logError, logInform } from "../logging";
import { getER21Moves } from "./moves/er21";
import { getVanillaMoves } from "./moves/vanilla";
import { getER21Species } from "./species/er21";
import { getVanillaSpecies } from "./species/vanilla";
import { extendNestedFilePathWithProjectPath } from "../parse_utils";
import { VersionsLists } from "../../config"

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

const grabMab: Record<VersionsLists, (precursor: PProcessorData)=>void> = {
    vanilla: function (precursor: PProcessorData): void {
        getVanillaSpecies(precursor, (data)=>{
            exportData(data)
            logInform("finished to grab vanilla species")
        })
    },
    "ER2.1": function (precursor: PProcessorData): void {
        getER21Moves(precursor, (data)=>{
            exportData(data)
            logInform("finished to grab er21 moves")
        })
    }
}