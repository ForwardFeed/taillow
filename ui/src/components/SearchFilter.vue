<script lang="ts" setup generic="DataTarget, FilterFields extends string">
import { useMouseClickedOutsideClass } from '@/composable/mouse';
import { findNearestSearchField, fuzzySearch, getQueryOperators, queryOperators, type FilterMap, type SearchUnit } from '@/data/search/search';
import router from '@/router';
import { useVersionStore } from '@/stores/versions';
import { rand } from '@vueuse/core';
import { type Ref, ref, watch } from 'vue';

type Props = {
    filterFields: readonly FilterFields[],
    data: DataTarget[],
    filterMap: FilterMap<FilterFields, DataTarget>,
}
const props = withDefaults(defineProps<Props>(), {
    
})
const emits = defineEmits<{
    (e: "update", indexes: number[]): void,
}>()

const versionStore = useVersionStore()

const advancedSearch = ref(false)
const suggestionsBlock  = ref(false)
const searchInput = ref(new URLSearchParams(window.location.search).get("s") || "")
const searchInputRef = ref()

const suggestions: Ref<string[]> = ref([])
//@ts-ignore I'll see that another day
const searchInputsDatas: Ref<SearchUnit<FilterFields>[]> = ref(parseValueForInput(searchInput.value))
const allSearchFields = props.filterFields.concat(["" as FilterFields])

const randomPlaceHolderSearchInput = (function(){
    const list = [
        "This is a search bar",
        'Comma is used as a separator, for exemple fire:type, ability:thick fat',
        '":" is used after a word to indicate a specific search field, for exemple fire:type will only give fire types',
        "the search isn't case sensitive, so Bunbasaur or bunbsaur is the same, if not then it's a bug",
        `Numerical fields may support prefix operators such as ${queryOperators.join(', ')}, for exemple >=80:power`,
        "the prefix ! is used to negate a search so !fire:type will give anything that is NOT fire"
    ]
    return list[rand(0, list.length - 1)]      
})()

let searchTimeout = 0
let suggTimeout = 0
let cursorPointerStart = 0
let cursorDataIndex = 0
let isUserTyingFields = false
let suggestionControl = 0
let inputSelectionMemory: string | undefined = undefined

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
            field = findNearestSearchField(field, props.filterFields as FilterFields[]) as FilterFields
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
            filterOutput = fuzzySearch(props.filterFields, props.filterMap, acc.data, curr.input.toLowerCase() as Lowercase<string>, curr.operator.operator)
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
                //trying to figure out if the user is trying to type a :field
                const fields = s.split(':')
                // if the user typed : at least 
                isUserTyingFields = fields[1] !== undefined
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
        const activeField = searchInputsDatas.value[cursorDataIndex]
        const suggestionsOutput = isUserTyingFields ?
            props.filterFields.map(x => `${activeField.input}:${x}`) :
            filterOutput.suggestions
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
        const op = x.operator.operator || ""
        const field = x.field ? `:${ x.field}`: ""
        return `${neg}${op}${x.input}${field}`
    }).join(', ')
    updateURL()
}

function clickSelection(sugg: string){
    searchInputsDatas.value[cursorDataIndex] = parseValueForInput(sugg)[0]
    searchInputDatasToSearchBar()
    inputSearch()
    const target = searchInputRef.value as HTMLInputElement
    target.focus()
    suggestionsBlock.value = false
}

function tabToNextField(opposite = false){
    const currIndex = props.filterFields.indexOf(searchInputsDatas.value[cursorDataIndex].field as FilterFields)
    if (~currIndex){
        searchInputsDatas.value[cursorDataIndex].field = props.filterFields[currIndex + (opposite ? -1 : 1)]
    } else {
        searchInputsDatas.value[cursorDataIndex].field = props.filterFields[0]
    }
}

function keyboardInteract(event: KeyboardEvent){
    const suggsLen = suggestions.value.length
    switch(event.key){
        case "ArrowDown":
            if (!suggsLen)
                return
            suggestionControl = ++suggestionControl % suggsLen
            searchInputsDatas.value[cursorDataIndex] = parseValueForInput(suggestions.value[suggestionControl])[0]
            searchInputDatasToSearchBar()
        break
        case "ArrowUp":
            if (!suggsLen)
                return
            suggestionControl = --suggestionControl || (suggsLen - 1)
            searchInputsDatas.value[cursorDataIndex] = parseValueForInput(suggestions.value[suggestionControl])[0]
            searchInputDatasToSearchBar()
        break
        case "ArrowLeft":
            inputSelectionMemory = searchInput.value
            searchInputsDatas.value = parseValueForInput(searchInput.value = "")
            inputSearch()
        break
        case "ArrowRight":
            if (inputSelectionMemory == undefined)
                return
            searchInputsDatas.value = parseValueForInput(searchInput.value = inputSelectionMemory)
            inputSelectionMemory = undefined
            inputSearch()
        break
        case "Tab":
            if (!suggsLen)
                return
            tabToNextField()
            searchInputDatasToSearchBar()
            event.preventDefault()
        break
        case "Control":
            if (!suggsLen)
                return
            tabToNextField(true)
            searchInputDatasToSearchBar()
        break
        case "Enter":
            suggestionsBlock.value = false
            inputSearch()
        break
        default:
            inputSelectionMemory = undefined
    }
}

// when you click outside the suggestions shuts down
watch(useMouseClickedOutsideClass('search-suggestion'), function(){
    suggestionsBlock.value = false
})

function addFilter(input: string, field?: string){
    searchInputsDatas.value.push({
        operator: {
            negative: false,
            operator: ''
        },
        input: input + (field ? ":" + field : "") 
    })
}

function openAdvancedSearch(){
    advancedSearch.value = !advancedSearch.value
}

function updateURL(){
    const route = router.currentRoute.value
    router.push({ name: route.name, params: route.params, query: { v:versionStore.chosenVersionName , s: searchInput.value}})
}   

watch(searchInputsDatas, updateURL)

// reactivity bugs a bit so this is a word around
function updateFromFilterGUI(){
    searchInputDatasToSearchBar()
    //inputSearch()
}

</script>
<template>
    <div class="search-block">
        <div class="adv-search-block bg3-alt" v-if="advancedSearch">
            <slot></slot>
            <div class="filter-block">
                <div v-for="(input, index) in searchInputsDatas" :key="index" class="filter-item">
                    <button @click="input.operator.negative = !input.operator.negative;updateFromFilterGUI()"
                    :style="input.operator.negative ? '' : 'text-decoration: line-through;'" class="filter-neg">
                        <span> ! </span>
                    </button>
                    <select v-model="input.operator.operator" @change="updateFromFilterGUI()" class="filter-op">
                        <option v-for="op in queryOperators" :key="op"  :value="op">
                            {{ op }}
                        </option>
                    </select>
                    <input type="text" class="filter-input" v-model="input.input" @input="updateFromFilterGUI()">
                    <select v-model="input.field" @change="updateFromFilterGUI()" class="filter-field">
                        <option v-for="field in allSearchFields" :key="field"  :value="field">
                            {{ field }}
                        </option>
                    </select>
                    <div @click="searchInputsDatas.splice(index, 1);updateFromFilterGUI()" class="filter-cross"> 
                        (x)
                    </div>
                </div>
                <div class="filter-item" @click="addFilter('');updateFromFilterGUI()">
                    add +
                </div>
            </div>
        </div>
        <div class="search-bar">
            <input type="text" class="search-input" @input="inputSearch" :placeholder="randomPlaceHolderSearchInput" 
            v-model="searchInput" ref="searchInputRef" @keydown="keyboardInteract" >
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
    padding-right: 0.4em;
    font-size: 0.8em;
    text-align: center;
    display: flex;
}
.filter-item > *{
    margin: auto;
}
.filter-neg{
    width: 1em
}
.filter-op{
    width: 2em;
}
.filter-input{
    width: 11em;
    overflow: hidden;
}
.filter-field{
    width: 5em
} 
.filter-cross{
    color: red
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