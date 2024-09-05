import { FullConfig } from "./src/config_handler";

type VersionsLists = "vanilla" | "ER2.1"

export const config: FullConfig<VersionsLists> = {
    logLevel: "WARN",
    active: "ER2.1",
    list: {
        "vanilla":{
            "git": {
                "branch": "master",
                "commit": false,
                "autoUpdate": false,
                "lastCommit": ""
            },
            "folder": "/disk/sdb3/Programation/C/pokeemerald-expansion/",
            "precursor": [
                "include/config/general.h"
            ]
        },
        "ER2.1":{
            "git": {
                "branch": "master"
            },
            "folder": "/disk/sdb3/Website/eliteredux2/",
            "precursor": "#include/global.h"
        }
    }
}