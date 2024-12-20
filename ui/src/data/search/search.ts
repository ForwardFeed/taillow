import { assertUnreachable } from "@/utils/utils"

export type ReorderMap<Field extends string, Data> = Record<Field, ((data: Data[])=>number[])>

export type FilterOutput = {indexes: number[], suggestions: string[]}
export type FilterMap<Field extends string, Data> = Record<Field, (data: Data[], input: Lowercase<string>, operator: QueryOperators)=>FilterOutput>

interface IndexAble<T> {
    indexOf: (any: T)=>number
}

export const queryOperators = ["<", "<=", ">", ">=", "==", "!=", ""] as const
export type QueryOperators = (typeof queryOperators)[number]

export type OperatorInQuery = {
    negative: boolean
    operator: QueryOperators
}

export type SearchUnit<Fields> = {
    operator: OperatorInQuery
    field?: Fields
    input: string
}

export function findNearestSearchField<T extends string>(input: string, searchFields: T[]): T | undefined{
    
    return searchFields.find(x => AisInB(input, x))
}

export function AisInB<T extends IndexAble<S>, S>(a: S, b:T): boolean{
	if (b.indexOf(a) != -1){
		return true
	} 
	return false
}

export function findIndexesOfString(strings: string[], input: string): number[]{
    return strings.reduce((acc, curr, index) => {
        if (AisInB(input, curr.toLowerCase()))
            acc.push(index)
        return acc
    }, [] as number[])
}



export function getQueryOperators(input: string): OperatorInQuery{
    let negative = false
    let operator: QueryOperators
    if (input[0] == "!" && input[1] != "="){
        negative = true
        input = input.slice(1)
    }
    switch(input[0]){
        case ">":
            operator = input[1] == "=" ? ">=" : ">"
            break
        case "<":
            operator = input[1] == "=" ? "<=" : "<"
            break
        case "=":
            operator = input[1] == "=" ? "==" : ""
            break
        case "!":
            operator = input[1] == "=" ? "!=" : ""
            break
        default: 
            operator = ""
    }
    return {negative, operator}
}

export function findIndexesOfStringWithOperator(datas: string[], input: string, operator: QueryOperators): number[]{
    switch(operator){
        case "==":
            return datas.reduce((acc, curr, index)=>{
                if (input == curr)
                    acc.push(index)
                return acc
            }, [] as number[])
        case "": //those are effectively ignored
        case ">":
        case ">=":
        case "<":
        case "<=":
            return datas.reduce((acc, curr, index)=>{
                if (AisInB(input, curr))
                    acc.push(index)
                return acc
            }, [] as number[])
        case "!=":
            return datas.reduce((acc, curr, index)=>{
                if (curr != input)
                    acc.push(index)
                return acc
            }, [] as number[])
        default:
            assertUnreachable(operator)
    }
}

export function findIndexOfNumericalWithOperators(datas: number[], input: string, operator: QueryOperators): number[]{
    const numerized = +input
    if (isNaN(numerized))
        return []

    switch(operator){
        case "":
        case "==":
            return datas.reduce((acc, curr, index)=>{
                if (curr == numerized)
                    acc.push(index)
                return acc
            }, [] as number[])
        case ">":
            return datas.reduce((acc, curr, index)=>{
                if (curr > numerized)
                    acc.push(index)
                return acc
            }, [] as number[])
        case ">=":
            return datas.reduce((acc, curr, index)=>{
                if (curr >= numerized)
                    acc.push(index)
                return acc
            }, [] as number[])
        case "<":
            return datas.reduce((acc, curr, index)=>{
                if (curr < numerized)
                    acc.push(index)
                return acc
            }, [] as number[])
        case "<=":
            return datas.reduce((acc, curr, index)=>{
                if (curr <= numerized)
                    acc.push(index)
                return acc
            }, [] as number[])
        case "!=":
            return datas.reduce((acc, curr, index)=>{
                if (curr != numerized)
                    acc.push(index)
                return acc
            }, [] as number[])
        default:
            assertUnreachable(operator)
    }
}

export function fuzzySearch<Fields extends string, Data>(
    fields: readonly Fields[], filterMap: FilterMap<Fields, Data>, data: Data[], input: Lowercase<string>, operator: QueryOperators): FilterOutput{
    return fields.reduce((acc, field)=>{
        const filterOutput = filterMap[field](data, input, operator)
        return {
            indexes: [...new Set(filterOutput.indexes.concat(acc.indexes))],
            suggestions: acc.suggestions.concat(filterOutput.suggestions.map(x => `${x}:${field}`))
        }
    }, 
    {indexes: [] as number[], suggestions: [] as string[]} as FilterOutput)
}

/**
 * The idea is that instead of redoing the search if it hasn't been changed 
 * For that it would be great if it was something that takes a query, well a part of it
 * (input, field, negative, operator)
 * Look if it has been already tried before and take the result from there.
 * This solution is simple enough, a 
 * 
 * AND if the search is obviously a subpart of the previous query, then it wouldn't be 
 * Bad to apply the search only on the previous result
 * If you add a letter you will not have more result possible, you will have less.
 * Ideally this should be given this way
 */
function fetchCache(){
    
}

function putToCache(){
    
}

const cache = []