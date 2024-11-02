
export type ReorderMap<Field extends string, Data> = Record<Field, ((data: Data[])=>number[]) | undefined>

export type FilterOutput = {indexes: number[], suggestions: string[]}
export type FilterMap<Field extends string, Data> = Record<Field, (data: Data[], input: Lowercase<string>)=>FilterOutput>

interface IndexAble<T> {
    indexOf: (any: T)=>number
}
export function AisInB<T extends IndexAble<S>, S>(a: S, b:T){
	if (b.indexOf(a) != -1){
		return true
	} 
	return false
}

export function makeSuggestions<T>(data: T[], indexes: number[], field: (keyof T) | ((t:T)=>string), nSuggestions = 8): string[]{
    const suggs = []
    for(let i = 0; i < nSuggestions; i++){
        if (typeof field === "function"){
            suggs[i] = field(data[indexes[i]])
        } else {
            suggs[i] = data[indexes[i]]?.[field] as string
        }
    }
    return suggs
}

export function fuzzySearch<Fields extends string, Data>(
    fields: readonly Fields[], filterMap: FilterMap<Fields, Data>, data: Data[], input: Lowercase<string>): FilterOutput{
    return fields.reduce((acc, field)=>{
        const filterOutput = filterMap[field](data, input)
        return {
            indexes: [...new Set(filterOutput.indexes.concat(acc.indexes))],
            suggestions: acc.suggestions.concat(filterOutput.suggestions.map(x => {
                if (~acc.suggestions.indexOf(x))
                    return x
                return `${x}_(${field})`
            }))
        }
    }, 
    {indexes: [] as number[], suggestions: [] as string[]} as FilterOutput)
}