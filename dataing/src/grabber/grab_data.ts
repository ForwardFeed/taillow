import { cPreprocessFileNest2, initPProcessorData, PProcessorData } from "../extractor/preprocessor";
import { chosenConfig, fullConfig } from "../config_handler";
import { WriteGamedataJson, writeGamedataGzip} from "../exporter/write_gamedata";
import { logError, logInform } from "../logging";
import { extendNestedFilePathWithProjectPath } from "../extractor/parse_utils";
import { VersionsAvailable } from "../../../config"
import { editVersion } from "../exporter/edit_version";
import { parameters } from "../cli_args";
import { grabSprites } from "./sprites.ts/sprites";
import { pack } from "../packer/packer";
import { getER25Abilities } from "./abilities/er25";
import { initGameData } from "./gamedata";
import { getER25NaturesTypesItems } from "./misc/er25";
import { getER25Moves } from "./moves/er25";
import { postGrabER25Abilities, postGrabER25Moves, postGrabER25Species, postGrabER25Trainer } from "./postgrab/er25";
import { getER25Species } from "./species/er25";
import { getER25Trainers } from "./trainers/er25";
import { getWorldMapER25 } from "./world_map/er25";



export function grabGameData(){
    cPreprocessFileNest2(extendNestedFilePathWithProjectPath(chosenConfig.precursor,chosenConfig.folder), initPProcessorData())
        .then((precursor)=>{
            logInform("Finished read precursor")
            grabMab[fullConfig.active](precursor)
            try{
                editVersion()
            } catch(err){
                logError("Failure while editing version file :" + err)
            }
        })
        .catch((err)=>{
            logError("Failure while preprocessing precursor:" + err)
        })
}

const grabMab: Record<VersionsAvailable, (precursor: PProcessorData)=>void> = {
    vanilla: function (precursor: PProcessorData): void {
        
    },
    "ER2.5": function (precursor: PProcessorData): void {
        if (parameters.spritesOnly){
            grabSprites(structuredClone(precursor))
            return
        }
        const gamedata = initGameData()
        /**
         * Issue with this design is that if just ONE(1) resolve gets dropped
         * The whole thing shutdowns silently with (to my knowledge) no way to tell who dropped the ball
         * At least a spaguetti callback hell code would have debug on that.
         */
        Promise.all([
            new Promise<void>((resolve, reject)=>{
                try{
                    getER25Abilities(structuredClone(precursor), (abilities)=>{
                        gamedata.abilities = postGrabER25Abilities(abilities)
                        resolve()
                    })
                }catch(e){
                    reject(`Error in getER25Abilities ${e}`)
                }
            }),
            new Promise<void>((resolve, reject)=>{
                try{    
                    getER25Species(structuredClone(precursor), (species)=>{
                        gamedata.species = postGrabER25Species(species)
                        resolve()
                    })
                }catch(e){
                    reject(`Error in getER25Species ${e}`)
                }
            }),
            new Promise<void>((resolve, reject)=>{
                try{    
                    getER25Trainers(structuredClone(precursor), (trainers)=>{
                        gamedata.trainers = postGrabER25Trainer(trainers)
                        resolve()
                    })
                }catch(e){
                    reject(`Error in getER25Trainers ${e}`)
                }
            }),
            new Promise<void>((resolve, reject)=>{
                try{    
                    getER25NaturesTypesItems(structuredClone(precursor), (data)=>{
                        gamedata.natures = data.natures,
                        gamedata.types = data.types
                        gamedata.items = data.items
                        resolve()
                    })
                }catch(e){
                    reject(`Error in getER25NaturesTypesItems ${e}`)
                }
            }),
            new Promise<void>((resolve, reject)=>{
                try{    
                    getWorldMapER25(structuredClone(precursor), (worldMaps)=>{
                        gamedata.worldMaps = worldMaps
                        resolve()
                    })
                }catch(e){
                    reject(`Error in getWorldMapER25 ${e}`)
                }
            }),
            new Promise<void>((resolve, reject)=>{
                try{    
                    getER25Moves(structuredClone(precursor), (moves)=>{
                        gamedata.moves = postGrabER25Moves(moves)
                        resolve()
                    })
                }catch(e){
                    reject(`Error in getER25Abilities ${e}`)
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
                logError(`Error packing ER25 ${e}`)
                throw "Error packing"
            }
            try{
                writefunc(dataPacked)
            } catch(e){
                logError(`Error writing ER25 ${e}`)
                throw "Error writing"
            }
        })
        .catch((err)=>{
            logError(`Error happenning in grab ER25, ${err}`)
        })
    }
}