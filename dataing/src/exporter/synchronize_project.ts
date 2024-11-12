import { existsSync, createReadStream,  createWriteStream} from 'fs';
import minimist from 'minimist';
import path from 'path';
import { versionsAvailable } from '../../../config';


const argv = minimist(process.argv.slice(2));

const syncConfig = {
    root: argv["root"],
    versions:  argv["versions"] || "dataing/dataOutput/versions.json",
    gamedata: argv["gamedata"] || "dataing/dataOutput/"
}

function getPathOfProject(){
    if (!syncConfig.root){
        console.error("--root is required, it's the root folder of the entire taillow codebase, where you find /calc /datating/ ui/ project_tui/")
        throw "BAD_CONFIG"
    }
        
}

function findVersionJSON(){
    const versionjson  = path.join(syncConfig.root, syncConfig.versions)
    if (!existsSync(versionjson)){
        console.error(`couldn't find file ${versionjson}. You may want to use --version to set the path relative to the root folder (set by --root)`)
        throw "BAD_CONFIG"
    }
        
    
}

function synchronizeJSONToUI(){
    createReadStream(
        path.join(syncConfig.root, syncConfig.versions))
        .pipe(
            createWriteStream(path.join(syncConfig.root, "ui/public/json/versions.json")));

    for (const versionName of versionsAvailable){
        const versionFile = `gamedataV${versionName}.json`
        const gamedataPath = path.join(syncConfig.root, syncConfig.gamedata, versionFile)
        if (!existsSync(gamedataPath)){
            console.warn(`gamedata of version ${versionName} cannot be found. Skipping.`)
            continue
        }

        createReadStream(gamedataPath)
            .pipe(
                createWriteStream(path.join(syncConfig.root, "ui/public/json/", versionFile)));
    }
}

function synchronizeGZIPToUI(){
    for (const versionName of versionsAvailable){
        const versionFile = `gamedataV${versionName}.gzip`
        const gamedataPathZip = path.join(syncConfig.root, syncConfig.gamedata, versionFile)
        if (!existsSync(gamedataPathZip)){
            console.warn(`gamedata zipped of version ${versionName} cannot be found. Skipping.`)
            continue
        }

        createReadStream(gamedataPathZip)
            .pipe(
                createWriteStream(path.join(syncConfig.root, "ui/public/gzip/", versionFile)));
    }
}

if(require.main === module) {
    if (argv["h"] || argv["help"]){
        console.log(`
--root is required, it's the root folder of the entire taillow codebase, where you find /calc /datating/ ui/ project_tui/
--version to set the path relative to the root folder (set by --root) of the version.json
--gamedata to set the path relative the root folder (set by --root) where you can find the gamedataV(X).json
`) 
    } else {
        getPathOfProject()
        findVersionJSON()
        synchronizeJSONToUI()
        synchronizeGZIPToUI()
    }
    
} 