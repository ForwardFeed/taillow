<script lang="ts" setup generic="DataTarget, FilterFields extends string, ReorderFields extends string">
import type { FilterMap, ReorderMap } from '@/data/search/search';
import { ref, type Ref } from 'vue';

type Props = {
    fields: readonly FilterFields[],
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

function input(event: Event){
    const target = event.target as HTMLInputElement
    const value = target.value
    const field = selectRef.value.value as FilterFields
    const filterOutput = props.filterMap[field](props.data, value.toLowerCase() as Lowercase<string>)
    suggestions.value = filterOutput.suggestions
    emits("update", filterOutput.indexes)
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
                        <option v-for="field of props.fields" :key="field" :value="field">
                            {{ field }}
                        </option>
                    </select>
                    <input type="search" class="search-input" @input="input" />
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
                    <div v-for="field of props.fields" :key="field" class="reorder-button">
                        {{ field}}
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