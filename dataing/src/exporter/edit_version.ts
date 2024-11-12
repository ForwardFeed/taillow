import * as fs from 'fs'
import { config } from '../../../config';
import { logInform, logSuccess } from '../logging';
import { execSync } from 'child_process';
import { DataVersions } from './types';
import path from 'node:path';
import { parameters } from '../cli_args';


function createVersionFile(){
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
    fs.writeFileSync(config.versionFile, JSON.stringify(defaultVersionFile))
}

export function editVersion(){
    if (!fs.existsSync(config.versionFile)){
        logInform("Couldn't find version file: " + config.versionFile + " So, creating it")
        createVersionFile()
    }
    const lastCommit =  execSync('git rev-parse HEAD',{
        cwd: config.list[config.active].folder   
    }).toString().trim()
    
    const versionFile = JSON.parse(fs.readFileSync(config.versionFile, "utf-8")) as DataVersions
    versionFile.list[config.active] = {
        date: Date.now(),
        commit: lastCommit,
    }
    const versionFilePath = path.join(parameters.export, "json", config.versionFile)
    logSuccess(`updating version file at ${versionFilePath}`)
    fs.writeFileSync(versionFilePath, JSON.stringify(versionFile))
}