import { FullConfig } from "./src/config_handler";

type VersionsLists = "vanilla" | "custom"

export const config: FullConfig<VersionsLists> = {
    logLevel: "WARN",
    active: "vanilla",
    list: {
        "vanilla":{
            "git": { // unused for now
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
        "custom":{
            "git": {
                "branch": "master"
            },
            "folder": "path your project pokeemerald folder",
            "precursor": "#include/global.h"
        }
    }
}