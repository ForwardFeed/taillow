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
import { CallbackTracker, initCallGrab } from "./grab_tracker";



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
            initCallGrab(getER21NaturesTypes, (gamedata, data)=>{
                gamedata.natures = data.natures,
                gamedata.types = data.types
            }, "finished to grab er21 Natures & types"),
        ], precursor).start()
    }
}