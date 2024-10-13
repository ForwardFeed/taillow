import { existsSync, createReadStream,  createWriteStream} from 'fs';
import minimist from 'minimist';
import path from 'path';
import { versionsAvailable } from '../config';


const argv = minimist(process.argv.slice(2));

const syncConfig = {
    root: argv["root"],
    versions:  argv["versions"] || "dataing/dataOutput/versions.js",
    gamedata: argv["gamedata"]
}

function getPathOfProject(){
    if (!syncConfig.root)
        throw "--root is required, it's the root folder of the entire taillow codebase, where you find /calc /datating/ ui/ project_tui/"
}

function findVersionJSON(){
    const versionjson  = path.join(syncConfig.root, syncConfig.versions)
    if (!existsSync(versionjson))
        throw "couldn't find file" + versionjson + ". You may want to use --version to set the path relative to the root folder (set by --root)"
    
}

function synchronizeUI(){
    createReadStream(
        path.join(syncConfig.root, syncConfig.versions))
        .pipe(
            createWriteStream(path.join(syncConfig.root, "ui/public/json/versions.json")));
    const gamedataP = path.join(syncConfig.root, syncConfig.gamedata)
    for (const version of versionsAvailable){
        const versionFile = `gamedataV${version}.json`
        createReadStream(
            path.join(syncConfig.root, syncConfig.gamedata, versionFile))
            .pipe(
                createWriteStream(path.join(syncConfig.root, "ui/public/json/", versionFile)));
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
        synchronizeUI()
    }
    
} 