import * as fs from 'fs'
import { config } from '../../../config_data';
import { logInform, logSuccess } from '../logging';
import { execSync } from 'child_process';
import { DataVersions } from './types';
import path from 'node:path';
import { parameters } from '../cli_args';


function createVersionFile(versionFilePath: string){
    const defaultVersionFile: DataVersions ={
        latest: "ER2.5",
        list: {
            'ER2.5': {
                date: Date.now(),
                commit: ''
            },
            vanilla: {
                date: Date.now(),
                commit: 'not set yet'
            }
        }
    }
    fs.mkdirSync(path.dirname(versionFilePath), { recursive: true });
      
    fs.writeFileSync(versionFilePath, JSON.stringify(defaultVersionFile))
}

export function editVersion(){
    const versionFilePath = path.join(parameters.export, "json", config.versionFile)
    if (!fs.existsSync(versionFilePath)){
        logInform("Couldn't find version file: " + versionFilePath + " So, creating it")
        createVersionFile(versionFilePath)
    }
    const lastCommit =  execSync('git rev-parse HEAD',{
        cwd: config.list[config.active].folder   
    }).toString().trim()
    
    const versionFile = JSON.parse(fs.readFileSync(versionFilePath, "utf-8")) as DataVersions
    versionFile.list[config.active] = {
        date: Date.now(),
        commit: lastCommit,
    }
    fs.writeFileSync(versionFilePath, JSON.stringify(versionFile))
    logSuccess(`updating version file at ${versionFilePath}`)
}