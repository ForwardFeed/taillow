import * as fs from 'fs'
import { config } from '../config';
import { logInform } from './logging';
import { execSync } from 'child_process';
import { DataVersions } from './export_types';


function createVersionFile(){
    const defaultVersionFile: DataVersions ={
        latest: "ER2.1",
        list: {
            'ER2.1': {
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
    fs.writeFileSync(config.versionFile, JSON.stringify(versionFile))
}