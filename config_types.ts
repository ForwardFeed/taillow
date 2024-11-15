export enum LogLevels {
    PERF,       // everything
    DEBUG,      // no perf, 
    INFORM,     // no debug, perf
    SUCCESS,    // no inform, debug, perf
    WARN,       // no inform, success, debug, perf
    ERROR,      // no inform, success, warn, debug, perf
    NONE        // completely silent
}

export type LogsLevelStr = keyof typeof LogLevels

/* this retroactive type pains to read, but with some examples it's quite simple
const _simple1  : NestedString = ""
const _simple2  : NestedString = ["", ""]
const _complex1 : NestedString = ["", ["", ""]]
const _complex2 : NestedString = ["", "", ["", "", ["", ""]]]
*/
export type NestedString = string | string[] | NestedString[]


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

export type ServerConfig = {
    port: number,
    //hostname: string,
    //protocol: "http" | "https",
    token: string,
    version: string,
    remote:  {
        owner: string,
        repo: string,
        branch: string,
    }
}

export type ConfigData<T extends string> = {
    logLevel: LogsLevelStr
    active: T
    list: Record<T, PartConfig>
    versionFile: string,
    server: ServerConfig,
}


export type GeneralConfig = {
    base: string,
}