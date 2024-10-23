import * as fs from 'fs'
import path from "path"
import { logInform, logSuccess} from '../logging'
import { fullConfig } from '../config_handler'
import { AllCompactGamedata } from './types'
import { gzip } from 'zlib'
import { parameters } from '../cli_args'
import { createDirectoryIfNotExist } from '../utils'


function getDataOutputDirectory(): string{
    return path.join(parameters.export)
}

export function WriteGamedataJson(gamedata: AllCompactGamedata, beautify = false){
    const dataOutputDirectory = getDataOutputDirectory()
    createDirectoryIfNotExist(dataOutputDirectory)
    createDirectoryIfNotExist(path.join(dataOutputDirectory, "json"))
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

export function writeGamedataGzip(gamedata: AllCompactGamedata){
    const dataOutputDirectory = getDataOutputDirectory()
    createDirectoryIfNotExist(dataOutputDirectory)
    createDirectoryIfNotExist(path.join(dataOutputDirectory, "gzip"))
    const gamedataFile = path.join(dataOutputDirectory, "gzip", `gamedataV${fullConfig.active}.gzip`)
    gzip(JSON.stringify(gamedata), (err, result)=>{
        if (err){
            throw `Failed gzip'd gamedata to ${gamedataFile}, reason:\n${err}`
        } else {
            fs.writeFile(gamedataFile, result, (err)=>{
                if (err){
                    throw `Failed writing to ${gamedataFile}, reason:\n${err}`
                } else {
                    logSuccess(`Success gzip'd gamedata to ${gamedataFile}`)
                }
            })
        }
    })
}