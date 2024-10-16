import * as fs from 'fs'
import { logSuccess } from './logging'

export type NestedString = string | string[] | NestedString[]

/* this retroactive type pains to read, but with some examples it's quite simple
const _simple1  : NestedString = ""
const _simple2  : NestedString = ["", ""]
const _complex1 : NestedString = ["", ["", ""]]
const _complex2 : NestedString = ["", "", ["", "", ["", ""]]]
*/

export type StringPacks= Array<string[]>



export function createDirectoryIfNotExist(path: string){
    if (!fs.existsSync(path)){
        logSuccess(`creating ${path}`)
        fs.mkdirSync(path)
        return
    }
    const stats = fs.statSync(path)
    if (!stats.isDirectory()){
        throw `${path} is not a directory as anticipated, data cannot be exported`
    }
    
}