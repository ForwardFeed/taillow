import * as fs from 'fs'
import { logError, logInform, LogLevels, LogsLevelStr, logSuccess, logWarn, setLogLevels} from './logging'
import assert from 'assert'
import { NestedString } from './utils_types'
import { extendNestedFilePathWithProjectPath } from './parse_utils'
import { config, VersionsAvailable } from '../config'

export type GitConfig = {
    branch: string,
    commit?: string | boolean
    autoUpdate?: boolean, 
    lastCommit?: string,
}

export type PartConfig = {
    git: GitConfig,
    folder: string,
    precursor: NestedString,
}

export type FullConfig<T extends string> = {
    logLevel: LogsLevelStr
    active: T
    list: Record<T, PartConfig>
    appName: string,
    versionFile: string,
}


export enum readConfigValue{
    OK,
    ERR,
}

export let fullConfig = config
export let chosenConfig: PartConfig = config.list[config["active"]]
export let projectPath = chosenConfig.folder

setLogLevels(fullConfig.logLevel)

export function loadExternalConfig(configPath: string){
     // check file existence
    if (!fs.existsSync(configPath)){
        logError(__filename + " failed to find file :" + configPath)
        return readConfigValue.ERR
    }
    // check file readability
    let configText
    try {
        configText = fs.readFileSync(configPath, "utf-8")
        assert(configText, "file empty?")
    } catch(e){
        logError(__filename + " failed to readfile: " + configPath + "\n\tError data : " + e)
        return readConfigValue.ERR
    }
    // check file json-ability
    let loadedconfig
    try {
        loadedconfig = JSON.parse(configText)
    } catch(e){
        logError(__filename + " failed to parse into JSON: " + configPath + "\n\tError data : " + e)
        return readConfigValue.ERR
    }
    //validation of the config object
    try{
        assert(typeof loadedconfig === "object", "config object is not an object")
        assert(typeof loadedconfig.list === "object", "list is not an object")
        assert(Object.keys(loadedconfig.list).length >= 1, "list is empty")
        if (loadedconfig.active === ""){
            const defaultConfig = Object.keys(loadedconfig.active)[0]
            logWarn("in configuration: active was not set, automatically set to " + defaultConfig)
            loadedconfig.active = defaultConfig;
        }
        assert(loadedconfig.list[loadedconfig.active]), "active is not in list"
        chosenConfig = loadedconfig.list[loadedconfig.active]
    } catch(e){
        logError(__filename + " error in validation " + configPath + "\n\tError data : " + e)
        return readConfigValue.ERR
    }
    if (!chosenConfig){
        logError(__filename + " error in validation " + configPath + "\n\tchosen config doesn't seems to be set")
        return readConfigValue.ERR
    }
    // just some small QoL tricks

    // setting it here to prevent
    projectPath = chosenConfig.folder
    fullConfig = loadedconfig

    return readConfigValue.OK
}

export function changeChosenConfig(version: VersionsAvailable){
    fullConfig.active = version
    chosenConfig = fullConfig.list[version]
}