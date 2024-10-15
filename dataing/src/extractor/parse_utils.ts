import { logInform, logPerf } from "../logging";
import { NestedString, StringPacks } from "../utils_types";
import { Operator } from "./extractor_types";

enum ResolveState{
    None,
    Parenthesis,
}

export type OperatorFunction =  (a: number, b:number)=> number
export const operatorSolvingFMap: {[key in Operator | string]:  OperatorFunction | undefined} = {
    [Operator.PLUS]: function (a: number, b:number):  number {
        return a + b
    },
    [Operator.MINUS]: function (a: number, b:number):  number {
        return a - b 
    },
    [Operator.WILDCARD]: function (a: number, b:number):  number {
        return a * b 
    },
    [Operator.SLASH]: function (a: number, b:number):  number {
        return a / b 
    },
    [Operator.GT]: function (a: number, b:number):  number {
        return a > b ? 1 : 0
    },
    [Operator.GTE]: function (a: number, b:number):  number {
        return a >= b ? 1 : 0
    },
    [Operator.LT]: function (a: number, b:number):  number {
        return a < b ? 1 : 0
    },
    [Operator.LTE]: function (a: number, b:number):  number {
        return a <= b ? 1 : 0
    },
    [Operator.EQUALS]: function (a: number, b:number):  number {
        return b 
    },
    [Operator.DEQUALS]: function (a: number, b:number):  number {
        return a == b ? 1 : 0
    },
    [Operator.OR]: function (a: number, b:number):  number {
        return a || b ? 1 : 0
    },
    [Operator.BOR]: function (a: number, b:number):  number {
        return a | b ? 1 : 0
    },
    [Operator.AND]: function (a: number, b:number):  number {
        return a && b ? 1 : 0
    },
    [Operator.BAND]: function (a: number, b:number):  number {
        return a & b ? 1 : 0
    },
    [Operator.XOR]: function (a: number, b:number):  number {
        return a ^ b ? 1 : 0
    },
    [Operator.EXCLAM]: function (a: number, b:number):  number {
        return a ? 0 : 1
    }
}

export type OperatorBoolFunction = (a: boolean, b: boolean) => boolean
export const operatorBoolSolvingFMap: {[key in Operator | string]:  OperatorBoolFunction | undefined} = {
    [Operator.GT]: function (a: boolean, b: boolean):  boolean {
        return a > b
    },
    [Operator.GTE]: function (a: boolean, b: boolean):  boolean {
        return a >= b
    },
    [Operator.LT]: function (a: boolean, b: boolean):  boolean {
        return a < b
    },
    [Operator.LTE]: function (a: boolean, b: boolean):  boolean {
        return a <= b
    },
    [Operator.EQUALS]: function (a: boolean, b: boolean):  boolean {
        return b 
    },
    [Operator.DEQUALS]: function (a: boolean, b: boolean):  boolean {
        return a == b
    },
    [Operator.OR]: function (a: boolean, b: boolean):  boolean {
        return a || b
    },
    [Operator.AND]: function (a: boolean, b: boolean):  boolean {
        return a && b
    },
    [Operator.EXCLAM]: function (a: boolean, b: boolean):  boolean {
        return !a
    }
}

/**
 * transforms a filenest into a series of string array
 * that is meant to be read block per block sequentially
 * so ["a", ["b", "c"]] => [["a"],["b", "c"]]
 */
export function nestedStringToPack(nestedString: NestedString, packs: StringPacks = [[]]){
    let packI= packs.length - 1
    if (typeof nestedString== "string"){
        packs[packI].push(nestedString)
    } else {
        packs[packI + 1]= []
        for (const stringN of nestedString){
            nestedStringToPack(stringN, packs)
        }
    }
    return packs
}




// ⚠️ Recursion hazard ahead ⚠️
/**
 * extend the file paths by the project path to not having to do it later
 **/ 
export function extendNestedFilePathWithProjectPath(nested: NestedString, prjpath: string): NestedString{
    if (typeof nested === "string")
        return prjpath + nested as NestedString
    for (let i = 0; i < nested.length; i++){
        const file = nested[i]
        if (typeof file === "string"){
            nested[i] = prjpath + file as NestedString
        } else {
            nested[i] = extendNestedFilePathWithProjectPath(file, prjpath)
        }
    }
    return nested
}

// remove some stuff made for better human readibility to more readable by a parser
export function normalize(str: string): string{
    return str
        // ANTISLASH END OF LINES
        //.replace(/\\\n/g, '')
        // ALL MULTIPLE SPACES TO ONE SPACE
        .replace(/[\t ]+/g, ' ')
}

export function clearEmptyLines(str: string): string{
    return str
        .replace(/\n[\s]{1,}\n/g, '\n')
}

/**
 * due to these regex mangling with comments in strings, this function is now unused 
 * and uncommenting is now completed in the tokenizer
 */
export function uncomment(text: string): string{
    const t0 = logPerf()
    text = text.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, "")
    logPerf(t0, `Uncommenting`)
    return text
}