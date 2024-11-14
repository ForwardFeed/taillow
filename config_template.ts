import { type FullConfig }  from "./config_type"

const versionsAvailable = ["vanilla", "ER2.5"] as const
export type VersionsAvailable = (typeof versionsAvailable)[number]

export const config: FullConfig<VersionsAvailable> = {
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
        "ER2.5":{
            "git": {
                "branch": "master"
            },
            "folder": "path your project pokeemerald folder",
            "precursor": "#include/global.h"
        }
    },
    appName: "Taillow",
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