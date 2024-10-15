import { OperatorFunction, operatorSolvingFMap } from "../extractor/parse_utils"
import { logWarn } from "../logging"


export function resolveNumber(tokens: string[], defaultVal = 0): number{
    if (!tokens){
        return defaultVal
    }
    if (tokens.length == 1 && !isNaN(+tokens[0])){
        return +tokens[0]
    }
    const [result, i] = resolveNumberSub(tokens)
    if (isNaN(result)){
        logWarn("Failed to resolve number " + tokens)
        return defaultVal
    }
    return result
}

type resolveResultNumber = [result: number, iterator: number]
function resolveNumberSub(tokens: string[], i = 0): resolveResultNumber{
    let solve = 0
    let operator = undefined as OperatorFunction | undefined
    const len = tokens.length
    for (;i < len; i++){
        let token = tokens[i] as string | number
        if (!token || token === ")" || token === ":" || token === ",")
            return [solve, i]
        
        if (token === "("){
            const rVal = resolveNumberSub(tokens, i + 1)
            token = rVal[0]
            i = rVal[1]
        } 
        else if (token === "?"){
            const a = resolveNumberSub(tokens, i + 1)
            const b = resolveNumberSub(tokens, a[1] + 1)
            i = b[1]
            if (solve){
                token = a[0]
            } else {
                token = b[0]
            }
        }
        if (operator){
            solve = operator(solve, +token)
            operator = undefined
        } else {
            operator = operatorSolvingFMap[token]
            if (!operator){
                solve = +token
            }
        }
    }
    return [solve, i]
}

export function resolveBoolean(tokens: string[], defaultVal = false): boolean{
    if (!tokens) 
        return defaultVal
    if (tokens.length == 1 && tokens[0] == "FALSE")
        return false
    if (tokens.length == 1 && tokens[0] == "TRUE")
        return true
    const [result, i,  invalid] = resolveForBoolean(tokens)

    if (!invalid){
        //probably got numberized?
        return !!result
    }
    if (invalid == "FALSE")
        return false
    if (invalid == "TRUE")
        return true
    logWarn("Not sure to solve this boolean expression right " + tokens.join("") + " -> " + invalid)
    return !!invalid
}
/**
 * if a token isn't numberizable aka gives NaN, then we can consider it to be what we're looking for 
 */
type resolveResultForBoolean = [result: number, i: number, invalid: string]
function resolveForBoolean(tokens: string[], i = 0): resolveResultForBoolean{
    let invalid = ""
    let solve = 0
    let operator = undefined as OperatorFunction | undefined
    const len = tokens.length
    for (;i < len; i++){
        let token = tokens[i] as string | number
        if (!token || token === ")" || token === ":" || token === ",")
            return [solve, i, invalid]
        
        if (token === "("){
            const rVal = resolveNumberSub(tokens, i + 1)
            token = rVal[0]
            i = rVal[1]
        } 
        else if (token === "?"){
            const a = resolveNumberSub(tokens, i + 1)
            const b = resolveNumberSub(tokens, a[1] + 1)
            i = b[1]
            if (solve){
                token = a[0]
            } else {
                token = b[0]
            }
        }
        if (operator){
            if (isNaN(+token)){
                invalid = token + ""
            }
            solve = operator(solve, +token)
            operator = undefined
        } else {
            operator = operatorSolvingFMap[token]
            if (!operator){
                if (isNaN(+token)){
                    invalid = token + ""
                }
                solve = +token
            }
        }
    }
    return [solve, i, invalid]
}


export function resolveString(tokens: string[], defaultVal = ""): string{
    if (!tokens){
        return defaultVal
    }
    if (tokens.length == 1)
        return tokens[0]
    const [result, i,  invalid] = resolveForBoolean(tokens)

    if (!invalid){
        //probably got numberized?
        return result == 1 ? "TRUE" : "FALSE" 
    }
    return invalid
}


export function getItemFromMap<T>(map: Map<string, T>, key: string,defaultVal: T, field: string = ""):T{
    if (!key) return defaultVal
    if (!map.has(key)){
        logWarn((field ? field + ": " : "") + "Couldn't find the key of " + key)
        return defaultVal
    }
    return map.get(key) as T
}

export function sliceLast<T>(any: T[]): T[]{
    if (!any)
        return any
    return any.slice(0, any.length - 1)
}

type Sample = {
    count: number,
    data: any[]
}
const samples = new Map<string, Sample>()

export function debugSample(id: string, count: number, data: any){
    if (samples.has(id)){
        const sample = samples.get(id) as Sample
        if (!sample.count)
            return
        sample.count--
        sample.data.push(data)

    } else {
        if (count <= 0)
            count = 1
        const sample = []
        samples.set(id, {
            count: count - 1,
            data: [data]
        })
    }
}

export function retrieveDebugSamples(){
    samples.forEach((val, key, samples)=>{
        console.log(`Samples of ${key}: ${JSON.stringify(val.data, null, 4)}`)
        samples.delete(key)
    })
}