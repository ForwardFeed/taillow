

const filterOperators = ["AND", "OR"] as const
type FilterOperators = (typeof filterOperators)[number]
//historyOfFilters ?
type SearchFilterGroup<T extends string> = {
    filters: Array<SearchFilter<T> | FilterOperators>
}

const availableFields = ["name", "type"] as const
type AvailableFields = (typeof availableFields)[number]
type SearchFilter<T extends string> = {
    field: T,
    data: string,
    inverted: boolean,
    optionnal: boolean,
    valid: boolean
}
const xd: SearchFilter<AvailableFields> = {
    field: "type",
    data: "",
    inverted: false,
    optionnal: false,
    valid: false
}

// maybe using a computed to generate the data? but that would end up in a composable

export type ReorderMap<T extends string, D> = Record<T, (data: D[])=>number[]>
export type FilterMap<T extends string, D> = Record<T, (data: D[], input: Lowercase<string>)=>number[]>

interface IndexAble<T> {
    indexOf: (any: T)=>number
}
export function AisInB<T extends IndexAble<S>, S>(a: S, b:T){
	if (b.indexOf(a) != -1){
		return true
	} 
	return false
}
