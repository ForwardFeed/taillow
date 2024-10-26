
const ROData = ["a", "b", "c"] as const
type DATATYPE = typeof ROData
export const data = structuredClone(ROData)

const handler = {
    get(target, prop, receiver ){
        if (prop === "")
            return 0
    }
}

const filterOperators = ["AND", "OR"] as const
type FilterOperators = (typeof filterOperators)[number]
//historyOfFilters ?
type SearchFilterGroup = {
    filters: Array<SearchFilter | FilterOperators>
}

const availableFields = ["name", "type"] as const
type AvailableFields = (typeof availableFields)[number]
type SearchFilter = {
    field: AvailableFields,
    data: string,
    inverted: boolean,
    optionnal: boolean,
    valid: boolean
}
const filtersData: SearchFilter[] = []
function applyFilter(filters: SearchFilter[]){
    const valids = filters.map(x => x.valid)
    
}

type SearchReorder = {
    field: string
}

function reorder(){

}

function createPreSearchTree(){

}

const cache = []

const dataProxy = new Proxy(ROData, handler)


// maybe using a computed to generate the data? but that would end up in a composable
