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
import { getER21Abilities } from "./abilities/er21";
import { editVersion } from "../exporter/edit_version";
import { parameters } from "../cli_args";
import { grabSprites } from "./sprites.ts/sprites";
import { getER21Trainers } from "./trainers/er21";
import { getER21NaturesTypesItems } from "./misc/er21";
import { initGameData21 } from "./gamedata/er21";
import { pack } from "../packer/packer";
import { getWorldMapER21 } from "./world_map/er21";



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
            grabSprites(structuredClone(precursor))
            return
        }
        const gamedata = initGameData21()
        Promise.all([
            new Promise<void>((resolve, reject)=>{
                try{
                    getER21Abilities(structuredClone(precursor), (abilities)=>{
                        gamedata.abilities = abilities
                        resolve()
                    })
                }catch(e){
                    reject(`Error in getER21Abilities ${e}`)
                }
            }),
            new Promise<void>((resolve, reject)=>{
                try{    
                    getER21Species(structuredClone(precursor), (species)=>{
                        gamedata.species = postGrabER21Species(species)
                        resolve()
                    })
                }catch(e){
                    reject(`Error in getER21Species ${e}`)
                }
            }),
            new Promise<void>((resolve, reject)=>{
                try{    
                    getER21Trainers(structuredClone(precursor), (abilities)=>{
                        gamedata.trainers = abilities
                        resolve()
                    })
                }catch(e){
                    reject(`Error in getER21Trainers ${e}`)
                }
            }),
            new Promise<void>((resolve, reject)=>{
                try{    
                    getER21NaturesTypesItems(structuredClone(precursor), (data)=>{
                        gamedata.natures = data.natures,
                        gamedata.types = data.types
                        gamedata.items = data.items
                        resolve()
                    })
                }catch(e){
                    reject(`Error in getER21NaturesTypesItems ${e}`)
                }
            }),
            new Promise<void>((resolve, reject)=>{
                try{    
                    getWorldMapER21(structuredClone(precursor), (worldMap)=>{
                        //gamedata.worldMap = worldMap
                        resolve()
                    })
                }catch(e){
                    reject(`Error in getWorldMapER21 ${e}`)
                }
            }),
            new Promise<void>((resolve, reject)=>{
                try{    
                    getER21Moves(structuredClone(precursor), (moves)=>{
                        gamedata.moves = moves
                        resolve()
                    })
                }catch(e){
                    reject(`Error in getER21Abilities ${e}`)
                }
            }),
        ])
        .then(()=>{
            const writefunc = parameters.format === "GZIP" ? writeGamedataGzip : WriteGamedataJson
            let dataPacked
            try{
                dataPacked = pack(gamedata)
            }catch(e){
                console.trace(e)
                logError(`Error packing ER21 ${e}`)
                throw "Error packing"
            }
            try{
                writefunc(dataPacked)
            } catch(e){
                logError(`Error writing ER21 ${e}`)
                throw "Error writing"
            }
        })
        .catch((err)=>{
            logError(`Error happenning in grab ER21, ${err}`)
        })
    }
}