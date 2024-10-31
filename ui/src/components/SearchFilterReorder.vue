<script lang="ts" setup generic="DataTarget, searchFields extends string">
import type { FilterMap, ReorderMap } from '@/data/search/search';
import { ref, type Ref } from 'vue';

type Props = {
    searchFields: readonly searchFields[],
    data: DataTarget[],
    filterMap: FilterMap<searchFields, DataTarget>,
    reorderMap: ReorderMap<searchFields, DataTarget>
}
const props = withDefaults(defineProps<Props>(), {
    
})
const suggestions: Ref<string[]> = ref([])
const selectRef = ref()
const inputRef = ref()
const datalist = ref()
const emits = defineEmits<{
    (e: "update", indexes: number[]): void,
}>()

let filterIndexes = [...Array(props.data.length).keys()]
let reorderIndexes = [...Array(props.data.length).keys()]

function emitUpdate(){
    emits("update", reorderIndexes.reduce(function(filtered, current){
        if (~filterIndexes.indexOf(current)){
            filtered.push(current)
        }
        return filtered
    }, [] as number[]))
}

function inputSearch(event: Event){
    const target = event.target as HTMLInputElement
    const value = target.value
    const field = selectRef.value.value as searchFields
    const filterOutput = props.filterMap[field](props.data, value.toLowerCase() as Lowercase<string>)
    const suggestionsOutput = filterOutput.suggestions.filter(x => x)
    suggestions.value = (value && suggestionsOutput.length > 1) ? suggestionsOutput : []
    filterIndexes = filterOutput.indexes
    emitUpdate()
}

const reorderStatus = props.searchFields.map(x => {return {
    status: ref("→"),
    field: x
}})
function changeReorder(fieldIndex: number){
    const status = reorderStatus[fieldIndex]
    const func = props.reorderMap[status.field]
    if (!func)
        return
    let nextStatus
    if (status.status.value === "→"){
        reorderIndexes = func(props.data)
        nextStatus = "↓"
    } else if (status.status.value === "↓"){
        nextStatus = "↑"
        reorderIndexes = func(props.data).reverse()
    }
    else {
        nextStatus = "→"
        reorderIndexes = [...Array(props.data.length).keys()]
        
    }
    status.status.value = nextStatus
    emitUpdate()
}

function clickSelection(sugg: string){
    inputRef.value.value = sugg
}

type FilterFields = Ref<Record<searchFields, string[]>>
// ICF that creates the record
const filtersData: FilterFields = (function(){
    const record: FilterFields  = ref({}) as FilterFields
    props.searchFields.forEach(x => record.value[x] = [])
    return record
})()

function addFilter(field: searchFields){
    filtersData.value[field].push("")
}
function removeFilter(field: searchFields, index: number){
    delete filtersData.value[field][index]
    // remove all empty filters by the way
    filtersData.value[field] = filtersData.value[field].filter(x => x)
}

defineExpose({
    addFilter
})

const showSearchBox = ref(true)
const showFilterBox = ref(true)
</script>
<template>
    <div class="search-filter-reorder-container">
        <div class="search-box" v-if="showSearchBox">
            <datalist ref="datalist" id="datalist-huh">
                <option v-for="sugg of suggestions" :key="sugg" :value="sugg">
                    {{ sugg }}
                </option>
            </datalist>
            <div class="search-block">
                <div class="search-bar">
                    <select ref="selectRef" class="search-field">
                        <option v-for="field of props.searchFields" :key="field" :value="field">
                            {{ field }}
                        </option>
                    </select>
                    <input type="search" class="search-input" @input="inputSearch" ref="inputRef" list="datalist-huh" />
                    <div class="search-enter">
                        |>
                    </div>
                </div>
            </div>
            <div class="search-suggestions">
                <div v-for="sugg of suggestions" :key="sugg" class="search-suggestion" @click="clickSelection(sugg)">
                    {{  sugg }}
                </div>
            </div>
        </div>
        <div class="filter-reorder-box" v-if="showFilterBox">
            <div class="filter-reorder-table">
                <div class="reorder-bar">
                    <div v-for="field, index in props.searchFields" :key="index" class="reorder-button">
                        <div v-if="props.reorderMap[field]" @click="changeReorder(index)">
                            {{ field }} {{ reorderStatus[index].status }}
                        </div>
                        <div v-else>
                            {{ field }}
                        </div>
                    </div>
                </div>
                <div class="filter-table">
                    <div v-for="field, index in props.searchFields" :key="index" class="filter-col">
                        <div v-for="(filter, filterIndex) in filtersData[field]" :key="filterIndex" class="filter">
                            <input type="text" v-model="filtersData[field][filterIndex]">
                            <span class="filter-cross" @click="removeFilter(field, filterIndex)">x</span>
                        </div>
                        <div class="filter">
                            <button @click="addFilter(field)"> add filter</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="box-hide-show">
            <button @click="showSearchBox = !showSearchBox">Search</button>
            <button @click="showFilterBox = !showFilterBox">Filters</button>
        </div>
    </div>

</template>
<style scoped>
.search-filter-reorder-container{
    display: flex;
    background-color: yellowgreen;
    flex-direction: row;
}
.search-filter-reorder-container > *{
    
}
.search-box{
    background-color: rgb(170, 31, 31);
    display: flex;
    flex-direction: column;
    width: 30%;
}
.search-bar{
    height: 2em;
    display: flex;
    width: 100%;
}
.search-field{
    width: 30%;
    background-color: rgb(231, 132, 132);
}
.search-input{
    width: 60%;
    background-color: rgb(197, 73, 73);
}   
.search-enter{
    width: 10%;
}
.search-suggestions{
    height: 6em;
    display: flex;
    flex-wrap: wrap;
}
.search-suggestion{
    margin: auto;
    width: calc(49%);
    border: rebeccapurple solid 1px;
}
.filter-reorder-box{
    display: flex;
    flex-direction: column;
    flex-grow: 1; 
}
.filter-reorder-table{
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}
.reorder-bar{
    display: flex;
    width: 100%;
    height: 2em;
}
.reorder-button{
    margin: auto;
    display: flex;
    width: 100%;
}
.reorder-button > div{
    margin: auto;
}
.filter-table{
    display: flex;
    flex-grow: 1;
}
.filter-col{
    display: flex;
    width: 100%;
    flex-direction: column;
}
.filter{
    display: flex;
    margin: auto;
}
.filter > button{
    margin: auto;
}
.filter-text{

}
.filter-cross{

}
.box-hide-show{
    writing-mode: tb-rl;
    display: flex;
}
.box-hide-show > button{
    margin: auto;
}
/* Adapation to phone*/
@media (orientation: portrait) {
    .search-filter-reorder-container{
        flex-direction: column;
    }
    .search-box{
        width: 100%;
    }
}
</style>