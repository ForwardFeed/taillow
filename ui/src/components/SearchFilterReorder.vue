<script lang="ts" setup generic="DataTarget, FilterFields extends string, ReorderFields extends string">
import type { FilterMap, ReorderMap } from '@/data/search/search';
import { ref, type Ref } from 'vue';

type Props = {
    fieldsFielder: readonly FilterFields[],
    fieldsReorder: readonly ReorderFields[],
    data: DataTarget[],
    filterMap: FilterMap<FilterFields, DataTarget>,
    reorderMap: ReorderMap<ReorderFields, DataTarget>
}
const props = withDefaults(defineProps<Props>(), {
    
})
const suggestions: Ref<string[]> = ref([""].fill("", 0, 8))
const selectRef = ref()
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
    const field = selectRef.value.value as FilterFields
    const filterOutput = props.filterMap[field](props.data, value.toLowerCase() as Lowercase<string>)
    suggestions.value = filterOutput.suggestions
    filterIndexes = filterOutput.indexes
    emitUpdate()
}

function changeReorder(){
    const field = "name" as ReorderFields
    reorderIndexes = props.reorderMap[field](props.data)
    console.log(reorderIndexes)
    emitUpdate()
}

</script>
<template>
    <div class="search-filter-reorder-container">
        <div class="search-box">
            <datalist ref="datalist">
                <option value="test"></option>
            </datalist>
            <div class="search-box">
                <div class="search-bar">
                    <select ref="selectRef">
                        <option v-for="field of props.fieldsFielder" :key="field" :value="field">
                            {{ field }}
                        </option>
                    </select>
                    <input type="search" class="search-input" @input="inputSearch" />
                    <div class="search-enter">
                        |>
                    </div>
                </div>
            </div>
            <div class="search-suggestions">
                <div v-for="sugg of suggestions" :key="sugg" class="search-suggestion">
                    {{  sugg }}
                </div>
            </div>
        </div>
        <div class="filter-reorder-box">
            <div class="filter-reorder-table">
                <div class="reorder-bar">
                    <div v-for="field of props.fieldsFielder" :key="field" class="reorder-button">
                        <div v-if="//@ts-ignore
                        ~props.fieldsReorder.indexOf(field)" @click="changeReorder">
                            {{ field }} ->
                        </div>
                        <div v-else>
                            {{ field }}
                        </div>
                    </div>
                </div>
                <div class="filter-list">
                    <div class="filter">
                        <span class="filter-text"></span>
                        <span class="filter-cross">x</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<style scoped>
.search-filter-reorder-container{
    display: flex;
    background-color: yellowgreen;
    flex-direction: row;
}

.search-box{
    background-color: rgb(170, 31, 31);
    display: flex;
    flex-direction: column;
}
.search-bar{
    display: flex;
    width: calc(3em + 11em + 3em);
}
.search-field{
    width: 3em;
    background-color: rgb(231, 132, 132);
}
.search-input{
    width: 11em;
    background-color: rgb(197, 73, 73);
}   
.search-enter{
    width: 3em;
    word-wrap:normal;
}
.search-suggestions{

}
.search-suggestion{

}
.filter-reorder-box{
    display: flex;
    flex-grow: 1; 
}
.filter-reorder-table{
    display: flex;
    flex-grow: 1;
}
.reorder-bar{
    display: flex;
    flex-grow: 1;
}
.reorder-button{
    margin: auto;
}
.filter-list{

}
.filter{

}
.filter-text{

}
.filter-cross{

}
/* Adapation to phone*/
@media (orientation: portrait) {
    .search-filter-reorder-container{
        flex-direction: column;
    }
}
</style>