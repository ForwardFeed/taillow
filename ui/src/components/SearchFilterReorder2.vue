<script lang="ts" setup generic="DataTarget, SearchFields extends string">
import { fuzzySearch, type FilterMap, type ReorderMap } from '@/data/search/search';
import { rand } from '@vueuse/core';
import { type Ref, ref } from 'vue';

type Props = {
    searchFields: readonly SearchFields[],
    data: DataTarget[],
    filterMap: FilterMap<SearchFields, DataTarget>,
    reorderMap: ReorderMap<SearchFields, DataTarget>
}
const props = withDefaults(defineProps<Props>(), {
    
})
const emits = defineEmits<{
    (e: "update", indexes: number[]): void,
}>()
function emitUpdate(){
    emits("update", reorderIndexes.reduce(function(filtered, current){
        if (~filterIndexes.indexOf(current)){
            filtered.push(current)
        }
        return filtered
    }, [] as number[]))
}

const advancedSearch = ref(false)
const suggestionsBlock  = ref(false)
const searchInput = ref("")
const searchInputRef = ref()

let filterIndexes = [...Array(props.data.length).keys()]
let reorderIndexes = [...Array(props.data.length).keys()]
const suggestions: Ref<string[]> = ref([])

let searchTimeout = 0
let suggTimeout = 0

const reorderStatus = props.searchFields.map(x => {return {
    status: ref("→"),
    field: x
}})

/**
 * 1 : Split each string by space to be a different input
 * 2 : replace
 * 
 */
type SearchInputWithFields = string | {
    input: string,
    field: SearchFields,
}

function searchBarInputProcessing(input: string): SearchInputWithFields[]{
    return input.trim().replace(/_/g, ' ').split(" ").map(x => {
        if (!~x.indexOf(":"))
            return x
        const splitted = x.split(":")
        const searchField = splitted[1] as SearchFields
        //detect invalid queries, ignore them
        if (!props.filterMap[searchField])
            return splitted[0]
        return {
            input: splitted[0],
            field: searchField
        }
    })
}
/**
 * apply search as queries
 * 
 * Note about the translation mask:
 * As the search works in a waterwall design onto indexes
 * the last one of the search query will have indexes based on the one previously
 * [0, 1, 2, 3, 4, 5] //data given to the first query
 * [0,    2  3      ] // this is what will be given to the second
 * [      1         ] // this is what the third is gonna give
 * but 1 here will no longer be indexed the right way even tho it represents 2 but points
 * towards the value 1 if we take it naively  
 */
function applySearch(inputs: SearchInputWithFields[]): 
    {   indexes: number[],
        suggestions: string[],
        data: DataTarget[],
    }{
    let translationMask = [] as number[]
    return inputs.reduce((acc, curr)=>{
        let filterOutput
        if (typeof curr === "string"){
            filterOutput = fuzzySearch(props.searchFields, props.filterMap, acc.data, curr.toLowerCase() as Lowercase<string>)
        } else {
            filterOutput = props.filterMap[curr.field](acc.data, curr.input.toLowerCase() as Lowercase<string>)
        }
        if (inputs.length > 1){
            // start caring about index shifting
            if (!translationMask.length){
                // create it
                translationMask = filterOutput.indexes
            } else {
                filterOutput.indexes = filterOutput.indexes.map(x => translationMask[x])
                translationMask = filterOutput.indexes
            }
        }
        
        return {
            indexes: filterOutput.indexes,
            suggestions: filterOutput.suggestions,
            data: filterOutput.indexes.map(x => props.data[x])
        }
    }, {indexes: [] as number[],
        suggestions: [] as string[],
        data: props.data,
    })
}

function inputSearch(){
    // this is to prevent fast typing users from overcharging the search
    // It may feel less reactive this way tho
    if (searchTimeout)
        clearTimeout(searchTimeout)
    searchTimeout = setTimeout(()=>{
        // activate the search
        const inputs = searchBarInputProcessing(searchInput.value).filter(x => x)
        const filterOutput = inputs.length ? applySearch(inputs) : {
            suggestions: [],
            indexes: [...Array(props.data.length).keys()]
        }
        const suggestionsOutput = filterOutput.suggestions.filter(x => x).map(x => x.replace(/ /g, '_'))
        suggestions.value = (searchInput.value && suggestionsOutput.length > 1) ? suggestionsOutput.slice(0, 8) : []
        filterIndexes = filterOutput.indexes
        emitUpdate()
        showSuggestions()
        // don't forget to reset
        searchTimeout = 0
    }, 150)
    
}

function showSuggestions(){
    suggestionsBlock.value = false
    if (suggTimeout)
        clearTimeout(suggTimeout)
    suggTimeout = setTimeout(()=>{
        suggestionsBlock.value = true

    }, 500)
}

function clickSelection(sugg: string){
    const inputs = searchInput.value.trim().split(' ').slice(0, -1)
    inputs.push(sugg.replace(/ /g, '_'))
    searchInput.value = inputs.join(" ")
    inputSearch()
    const target = searchInputRef.value as HTMLInputElement
    target.focus()
}
/*
function addToSearchBar(input: string, field?: string){
    const shouldAddSpace = searchInput.value && searchInput.value[searchInput.value.length - 1] !== " "
        ?  " "
        : ""
    searchInput.value = `searchInput.value${shouldAddSpace}${input}${field ? `:${field}` : ""}`
}*/

function openAdvancedSearch(){
    advancedSearch.value = !advancedSearch.value
}

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

const randomPlaceHolderSearchInput = (function(){
    const list = [
        "This is a search bar",
        'Space is used as a separator and underscore is used "_" to replace spaces, for exemple venusaur_mega',
        '":" is used after a word to indicate a specific search field, for exemple fire:type will only give fire types',
        "the search isn't case sensitive, if it does then it's a bug",
        "Numerical fields may support prefix operators such as >, >=, <=, <, for exemple >=80:power",
        "some fields can be subject to the ! prefix operator, which turns the query upside down, so !fire:type will give anything that is NOT fire"
    ]
    return list[rand(0, list.length - 1)]      
})()

</script>
<template>
    <div class="search-block">
        <div class="adv-search-block" v-if="advancedSearch" style="background-color: #056f90;">
            <div class="reorder-bar">
                <div> Interact to reorder </div>
                <div v-for="field, index in props.searchFields" :key="index" class="reorder-button">
                    <div v-if="props.reorderMap[field]" @click="changeReorder(index)">
                        {{ field }} {{ reorderStatus[index].status }}
                    </div>
                </div>
            </div>
        </div>
        <div class="search-bar">
            <input type="text" class="search-input" @input="inputSearch" :placeholder="randomPlaceHolderSearchInput" 
            v-model="searchInput" ref="searchInputRef">
            <button class="search-open-advanced" @click="openAdvancedSearch">Adv. search</button>
        </div>
        <div class="sugg-block" v-if="suggestionsBlock">
            <div v-for="sugg of suggestions" :key="sugg" class="search-suggestion" @click="clickSelection(sugg)">
                    {{  sugg }}
                </div>
        </div>
    </div>
    
</template>
<style scoped>
    .search-block{
        display: flex;
        flex-direction: column;
    }
    .search-options-bar{
        display: flex;
    }
    .search-options-option{
        margin: auto;
    }
    .search-bar{
        width: 100%;
        display: flex;
    }
    .search-input{
        flex-grow: 1;
    }
    .search-open-advanced{
        width: fit-content;
    }
    /*.sugg-block{

    }*/
    .reorder-bar{
        display: flex;
    }
    .reorder-button{
        margin: auto
    }
</style>