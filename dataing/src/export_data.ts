import * as fs from 'fs'
import path from "path"
import { logInform, logSuccess} from './logging'
import { fullConfig } from './config_handler'
import { AllCompactGamedata } from './export_types'
import { gzip } from 'zlib'


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

export function exportGameData(gamedata: AllCompactGamedata, beautify = true){
    createOutDirectoryIfNot()
    //logInform(`${dataOutputDirectory} is a directory, outputing into it can start`)
    // write game data to a json file
    const gamedataFile = path.join(dataOutputDirectory, `gamedataV${fullConfig.active}.json`)
    fs.writeFile(gamedataFile, JSON.stringify(gamedata, beautify ? null : undefined, beautify ? 4 : undefined), function(err){
        if (err){
            throw `Failed writing json'd gamedata to ${gamedataFile}, reason:\n${err}`
        } else {
            logSuccess(`Success writing json'd gamedata to ${gamedataFile}`)
        }
    })
}

export function exportDataGzip(gamedata: AllCompactGamedata){
    console.log(gamedata)
    createOutDirectoryIfNot()
    const gamedataFile = path.join(dataOutputDirectory, `gamedataV${fullConfig.active}.gzip`)
    gzip(JSON.stringify(gamedata), (err, result)=>{
        if (err){
            throw `Failed gzip'd gamedata to ${gamedataFile}, reason:\n${err}`
        } else {
            fs.writeFile(gamedataFile, result, (err)=>{
                if (err){
                    throw `Failed writing to ${gamedataFile}, reason:\n${err}`
                } else {
                    logSuccess(`Success writing to ${gamedataFile}`)
                }
            })
            logSuccess(`Success gzip'd gamedata to ${gamedataFile}`)
        }
    })
}