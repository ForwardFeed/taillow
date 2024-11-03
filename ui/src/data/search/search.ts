
export type ReorderMap<Field extends string, Data> = Record<Field, ((data: Data[])=>number[]) | undefined>

export type FilterOutput = {indexes: number[], suggestions: string[]}
export type FilterMap<Field extends string, Data> = Record<Field, (data: Data[], input: Lowercase<string>)=>FilterOutput>

interface IndexAble<T> {
    indexOf: (any: T)=>number
}
export function AisInB<T extends IndexAble<S>, S>(a: S, b:T): boolean{
	if (b.indexOf(a) != -1){
		return true
	} 
	return false
}

export function findIndexesOfString(strings: string[], input: string){
    return strings.reduce((acc, curr, index) => {
        if (AisInB(input, curr.toLowerCase()))
            acc.push(index)
        return acc
    }, [] as number[])
}

export function fuzzySearch<Fields extends string, Data>(
    fields: readonly Fields[], filterMap: FilterMap<Fields, Data>, data: Data[], input: Lowercase<string>): FilterOutput{
    return fields.reduce((acc, field)=>{
        const filterOutput = filterMap[field](data, input)
        return {
            indexes: [...new Set(filterOutput.indexes.concat(acc.indexes))],
            suggestions: acc.suggestions.concat(filterOutput.suggestions.map(x => `${x}:${field}`))
        }
    }, 
    {indexes: [] as number[], suggestions: [] as string[]} as FilterOutput)
}