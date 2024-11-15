import { type ConfigData }  from "./config_types"
import { type VersionsAvailable } from "./config"

export const config: ConfigData<VersionsAvailable> = {
    logLevel: "WARN",
    active: "vanilla",
    list: {
        "vanilla":{
            "git": {
                "branch": "master", 
                "commit": false,
                "autoUpdate": false,
                "lastCommit": ""
            },
            "folder": "path to your pokeemerald folder", // mandatory
            "precursor": [ // optional
                // the # here is to indicate we are only seeking the preprocessing macros in it
                "#include/config/general.h"
            ]
        },
        "ER2.5":{
            "git": {
                "branch": "master"
            },
            "folder": "path your project pokeemerald folder",
            "precursor": "#include/global.h"
        }
    },
    versionFile: "dataOutput/versions.json",

    server: {
        port: 8080,
        token: "",
        version: "latest",
        remote:  {
            owner: "",
            repo: "",
            branch: "",
        }
    }
}