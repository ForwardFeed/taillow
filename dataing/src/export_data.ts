import * as fs from 'fs'
import path from "path"
import { logInform, logSuccess} from './logging'
import { fullConfig } from './config_handler'


const dataOutputDirectory = path.join("dataOutput")

function createOutDirectoryIfNot(){
    if (!fs.existsSync(dataOutputDirectory)){
        logSuccess(`creating ${dataOutputDirectory}`)
        fs.mkdirSync(dataOutputDirectory)
        return
    }
    const stats = fs.statSync(dataOutputDirectory)
    if (!stats.isDirectory()){
        throw `${dataOutputDirectory} is not a directory as anticipated, data cannot be exported`
    }
    
}

export function exportData(data: any){
    createOutDirectoryIfNot()
    //logInform(`${dataOutputDirectory} is a directory, outputing into it can start`)
    // write raw game data to a json file
    if (data.constructor.name == "Map"){
        data = Object.fromEntries(data)
    }
    const rawGameDataFile = path.join(dataOutputDirectory, `gameDataV${fullConfig.active}.json`)
    fs.writeFile(rawGameDataFile, JSON.stringify(data, null, 4), function(err){
        if (err){
            throw `Failed writing raw gamedata to ${rawGameDataFile}, reason:\n${err}`
        } else {
            logSuccess(`Success writing raw gamedata to ${rawGameDataFile}`)
        }
    })
}