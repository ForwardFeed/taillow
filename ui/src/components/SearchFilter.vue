<script lang="ts" setup generic="DataTarget, FilterFields extends string">
import { useMouseClickedOutsideClass, useMouseClickStatus } from '@/composable/mouse';
import { findNearestSearchField, fuzzySearch, getQueryOperators, queryOperators, type FilterMap, type SearchUnit } from '@/data/search/search';
import { rand } from '@vueuse/core';
import { type Ref, ref, watch } from 'vue';

type Props = {
    searchFields: readonly FilterFields[],
    data: DataTarget[],
    filterMap: FilterMap<FilterFields, DataTarget>,
}
const props = withDefaults(defineProps<Props>(), {
    
})
const emits = defineEmits<{
    (e: "update", indexes: number[]): void,
}>()

const advancedSearch = ref(false)
const suggestionsBlock  = ref(false)
const searchInput = ref("")
const searchInputRef = ref()

const suggestions: Ref<string[]> = ref([])
const searchInputsDatas: Ref<SearchUnit<FilterFields>[]> = ref([])

let searchTimeout = 0
let suggTimeout = 0
let cursorPointerStart = 0
let cursorDataIndex = 0


function parseValueForInput(value: string): SearchUnit<FilterFields>[]{
    const values = value.split(',').map(x => x.trim())
    return values.map(x => {
        const operator = getQueryOperators(x)
        x = x.replace(operator.operator, '')
        if (operator.negative)
            x = x.replace('!', '')
        const split = x.split(':')
        const input = split[0]
        let field = split[1] as FilterFields
        // if it's empty don't fetch one
        if (!props.filterMap[field] && field){
            field = findNearestSearchField(field, props.searchFields as FilterFields[]) as FilterFields
        }
        return {
            input,
            operator,
            field
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
function applySearch(inputs: SearchUnit<FilterFields>[]): 
    {   indexes: number[],
        suggestions: string[],
        data: DataTarget[],
    }{
    let translationMask = [] as number[]
    return inputs.reduce((acc, curr)=>{
        let filterOutput
        if (!curr.field){
            filterOutput = fuzzySearch(props.searchFields, props.filterMap, acc.data, curr.input.toLowerCase() as Lowercase<string>, curr.operator.operator)
        } else {
            filterOutput = props.filterMap[curr.field](acc.data, curr.input.toLowerCase() as Lowercase<string>, curr.operator.operator)
        }
        if (curr.operator.negative){
            const invertedIndexes = props.data.reduce((acc, _curr, index)=>{
                if (!~filterOutput.indexes.indexOf(index))
                    acc.push(index)
                return acc
            }, [] as number[])
            filterOutput.indexes = invertedIndexes
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


function shouldShowSuggestions(suggs: string[]): boolean{
    // if there's nothing in the bar that means that we don't care about that
    if (!searchInput.value)
        return false
    // if there's only on thing why show it
    if (suggs.length <= 1)
        return false
    return true
}

function inputSearch(event?: Event){
    if (event){
        const target = event.target as HTMLInputElement
        cursorPointerStart = target.selectionStart || 0
        const split = target.value.split(",")
        for (let i = 0, cum = 0; i < split.length; i++){
            const s = split[i]
            // the +i here because the , char gets removed as it is used in the splitting
            cum += s.length + i
            if (cum >= cursorPointerStart){
                cursorDataIndex = i
                break
            }
                
        }
        
    }
    // this is to prevent fast typing users from overcharging the search
    // It may feel less reactive this way tho
    if (searchTimeout)
        clearTimeout(searchTimeout)
    searchTimeout = setTimeout(()=>{
        // activate the search
        searchInputsDatas.value = parseValueForInput(searchInput.value)
        const filterOutput = searchInputsDatas.value.length ? applySearch(searchInputsDatas.value) : {
            suggestions: [] as string[],
            indexes: [...Array(props.data.length).keys()]
        }
        const suggestionsOutput = filterOutput.suggestions
        suggestions.value = shouldShowSuggestions(suggestionsOutput) ? suggestionsOutput.slice(0, 8) : [] as string[]
        emits("update", filterOutput.indexes)
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

function searchInputDatasToSearchBar(){
    searchInput.value = searchInputsDatas.value.map(x => {
        const neg = x.operator.negative ? "!" : ""
        const op = x.operator.operator
        const field = x.field ? `:${ x.field}`: ""
        return `${neg}${op}${x.input}${field}`
    }).join(', ')
}

function clickSelection(sugg: string){
    searchInputsDatas.value[cursorDataIndex] = parseValueForInput(sugg)[0]
    searchInputDatasToSearchBar()
    inputSearch()
    const target = searchInputRef.value as HTMLInputElement
    target.focus()
}

// when you click the suggestions shuts down
watch(useMouseClickedOutsideClass('search-suggestion'), function(){
    console.log('bruh')
    suggestionsBlock.value = false
})
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



const randomPlaceHolderSearchInput = (function(){
    const list = [
        "This is a search bar",
        'Comma is used as a separator, for exemple fire:type, ability:thick fat',
        '":" is used after a word to indicate a specific search field, for exemple fire:type will only give fire types',
        "the search isn't case sensitive, if it does then it's a bug",
        `Numerical fields may support prefix operators such as ${queryOperators.join(', ')}, for exemple >=80:power`,
        "the prefix ! is used to negate a search so !fire:type will give anything that is NOT fire"
    ]
    return list[rand(0, list.length - 1)]      
})()

</script>
<template>
    <div class="search-block">
        <div class="adv-search-block" v-if="!advancedSearch" style="background-color: #056f90;">
            <slot></slot>
            <div class="filter-block">
                <div v-for="(input, index) in searchInputsDatas" :key="index" class="filter-bar">
                    <div class="filter-item">
                        {{  input.operator.negative ? "!" : "" }}
                    </div>
                    <div class="filter-item">
                        {{ input.operator.operator}}
                    </div>
                    <div class="filter-item">
                        {{  input.input}}
                    </div>
                    <div class="filter-item">
                        {{  input.field ? input.field :  "general" }}
                    </div>
                </div>
            </div>
        </div>
        <div class="search-bar">
            <input type="text" class="search-input" @input="inputSearch" :placeholder="randomPlaceHolderSearchInput" 
            v-model="searchInput" ref="searchInputRef">
            <button class="search-open-advanced" @click="openAdvancedSearch">Adv. search</button>
        </div>
        <div class="suggs-anchor">
            <div class="suggs-block" v-if="suggestionsBlock">
            <div v-for="sugg of suggestions" :key="sugg" class="search-suggestion no-select" @click="clickSelection(sugg)">
                    {{  sugg }}
                </div>
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
    .filter-block{
        display: flex;
    }
    .filter-bar{
        display: flex;
    }
    .filter-item{
        padding-left: 0.4em;
    }
    .suggs-anchor{
        position: relative;
    }
    .suggs-block{
        z-index: 0;
        background: rgba(255, 255, 255, 0.5);
        position: absolute;
    }
    .search-suggestion{
        opacity: 1;
        cursor:pointer
    }
    .search-suggestion:hover{
        background: rgba(255, 255, 255, 1);
    }
</style>