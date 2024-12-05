<script lang="ts" setup>
import RowAbility from '@/components/RowAbility.vue';
import { abilitiesFilterMap, abilitiesReorderFields, abilitiesReorderMap, abilitiesFilterFields } from '@/data/search/abilities';
import { gamedata } from '@/stores/gamedata';
import { useVirtualList } from '@vueuse/core';
import { ref, markRaw, watch } from 'vue';
import SearchFilter from '@/components/SearchFilter.vue'
import ReorderBar from '@/components/ReorderBar.vue';

const dataListRef = ref(markRaw(gamedata.value.abilities))
const dataList = gamedata.value.abilities
const HEIGHT_ROW = 64
let reorderIndexes = [...Array(dataList.length).keys()]
let filterIndexes = [...Array(dataList.length).keys()]

const { list, containerProps, wrapperProps } = useVirtualList(
    dataListRef ,
    {
        itemHeight: HEIGHT_ROW,
    },
)

// because the app will often load before the data loads
watch(gamedata, ()=>{
    dataListRef.value = markRaw(gamedata.value.abilities)
})


function onUpdate(){
    dataListRef.value = reorderIndexes.reduce(function(filtered, current){
        if (~filterIndexes.indexOf(current)){
            filtered.push(current)
        }
        return filtered
    }, [] as number[]).map(x => gamedata.value.abilities[x])
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
        <SearchFilter :filterFields="abilitiesFilterFields" :data="dataList"
        @update="onSearchFilterUpdate" :filter-map="abilitiesFilterMap"/>
        <ReorderBar :data="dataList" :reorder-fields="abilitiesReorderFields" :reorder-map="abilitiesReorderMap" 
        @update="onReorderUpdate"/>
        <div v-bind="containerProps" class="scroll-container" >
            <div v-bind="wrapperProps">
                <template v-for="item in list" :key="item.index">
                    <RowAbility :abi="item.data" :height="HEIGHT_ROW"/>
                </template>
            </div>
        </div>
    </div>
</template>
<style scoped>

</style>