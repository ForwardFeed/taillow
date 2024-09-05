import * as fs from 'fs'
import path from "path"
import { logError, logInform, logSuccess, logWarn} from './logging'
import { programParams } from './cli_args'
import assert from 'assert'
import { NestedString } from './types'
import { extendNestedFilePathWithProjectPath } from './parse_utils'


export type PartConfigGit = {
    branch: string,
    commit: string | boolean
    autoUpdate: boolean,
    lastCommit: string,
}


// this retroactive type often pains to read, but i'll show you some example
const _simple1  : NestedString = ""
const _simple2  : NestedString = ["", ""]
const _complex1 : NestedString = ["", ["", ""]]
const _complex2 : NestedString = ["", "", ["", "", ["", ""]]]


export type PartConfig = {
    git: PartConfigGit,
    folder: string,
    precursor: NestedString,
}

export type FullConfig = {
    active: string
    list: {[key: string]: PartConfig}
}


export enum readConfigValue{
    OK,
    ERR,
}

export let fullConfig: FullConfig | undefined;
export let chosenConfig: PartConfig | undefined;
export let projectPath = ""

export function readConfig(){
    // check file existence
    if (!fs.existsSync(programParams.configPath)){
        logError(__filename + " failed to find file :" + programParams.configPath)
        return readConfigValue.ERR
    }
    // check file readability
    let configText
    try {
        configText = fs.readFileSync(programParams.configPath, "utf-8")
        assert(configText, "file empty?")
    } catch(e){
        logError(__filename + " failed to readfile: " + programParams.configPath + "\n\tError data : " + e)
        return readConfigValue.ERR
    }
    // check file json-ability
    try {
        fullConfig = JSON.parse(configText)
    } catch(e){
        logError(__filename + " failed to parse into JSON: " + programParams.configPath + "\n\tError data : " + e)
        return readConfigValue.ERR
    }
    //validation of the config object
    try{
        assert(typeof fullConfig === "object", "config object is not an object")
        assert(typeof fullConfig.list === "object", "list is not an object")
        assert(Object.keys(fullConfig.list).length >= 1, "list is empty")
        if (fullConfig.active === ""){
            const defaultConfig = Object.keys(fullConfig.active)[0]
            logWarn("in configuration: active was not set, automatically set to " + defaultConfig)
            fullConfig.active = defaultConfig;
        }
        assert(fullConfig.list[fullConfig.active]), "active is not in list"
        chosenConfig = fullConfig.list[fullConfig.active]
    } catch(e){
        logError(__filename + " error in validation " + programParams.configPath + "\n\tError data : " + e)
        return readConfigValue.ERR
    }
    // just some small QoL tricks
    chosenConfig.precursor = extendNestedFilePathWithProjectPath(chosenConfig.precursor,chosenConfig.folder)

    // setting it here to prevent
    projectPath = chosenConfig.folder

    return readConfigValue.OK
}

