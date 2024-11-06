<script lang="ts" setup>
import { gamedata } from '@/stores/gamedata';
import { useVirtualList } from '@vueuse/core';
import { ref, markRaw } from 'vue';
import SearchFilter from '@/components/SearchFilter.vue'
import ReorderBar from '@/components/ReorderBar.vue';
import { trainersFilterMap, trainersReorderFields, trainersReorderMap, trainersFilterFields } from '@/data/search/trainers';
import RowTrainer from '@/components/RowTrainer.vue';

const dataListRef = ref(markRaw(gamedata.value.trainers))
const dataList = gamedata.value.trainers
const HEIGHT_ROW = 64
let reorderIndexes = [...Array(dataList.length).keys()]
let filterIndexes = [...Array(dataList.length).keys()]

const { list, containerProps, wrapperProps } = useVirtualList(
    dataListRef ,
    {
        itemHeight: HEIGHT_ROW,
    },
)

function onUpdate(){
    dataListRef.value = reorderIndexes.reduce(function(filtered, current){
        if (~filterIndexes.indexOf(current)){
            filtered.push(current)
        }
        return filtered
    }, [] as number[]).map(x => gamedata.value.trainers[x])
}

function onReorderUpdate(indexes: number[]){
    reorderIndexes = indexes
    onUpdate()
}

function onSearchFilterUpdate(indexes: number[]){
    filterIndexes = indexes
    onUpdate()
}
</script>
<template>
    <div class="g-virtual-list-container-parent">
        <SearchFilter :filterFields="trainersFilterFields" :data="dataList"
        @update="onSearchFilterUpdate" :filter-map="trainersFilterMap"/>
        <ReorderBar :data="dataList" :reorder-fields="trainersReorderFields" :reorder-map="trainersReorderMap" 
        @update="onReorderUpdate"/>
        <div v-bind="containerProps" class="scroll-container" >
            <div v-bind="wrapperProps">
                <template v-for="item in list" :key="item.index">
                    <RowTrainer :trainer="item.data" :height="HEIGHT_ROW"/>
                </template>
            </div>
        </div>
    </div>
</template>
<style scoped>
    
</style>