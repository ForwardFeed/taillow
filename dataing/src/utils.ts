import * as fs from 'fs'
import { logSuccess } from './logging'



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