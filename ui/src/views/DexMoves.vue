<script lang="ts" setup>
import RowMove from '@/components/RowMove.vue';
import { movesFilterMap, movesReorderFields, movesReorderMap, movesFilterFields } from '@/data/search/moves';
import { gamedata } from '@/stores/gamedata';
import { useVirtualList } from '@vueuse/core';
import { markRaw, ref } from 'vue';
import SearchFilter from '@/components/SearchFilter.vue'
import ReorderBar from '@/components/ReorderBar.vue';

const dataListRef = ref(markRaw(gamedata.value.moves))
const dataList = gamedata.value.moves
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
    }, [] as number[]).map(x => gamedata.value.moves[x])
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
        <SearchFilter :searchFields="movesFilterFields" :data="dataList"
        @update="onSearchFilterUpdate" :filter-map="movesFilterMap">
        <div class="items-available-row">
            <div class="item-available-title"> Moves Flags Available: </div>
            <div  v-for="flag of gamedata.moveFlagsT" :key="flag"
            class="item-available">
                {{ flag }}
            </div>
        </div>
        <div class="items-available-row">
            <div class="item-available-title"> Moves Flags Ban Available: </div>
            <div  v-for="flag of gamedata.moveFlagsBanT" :key="flag"
            class="item-available">
                {{ flag }}
            </div>
        </div>
        <div class="items-available-row">
            <div class="item-available-title"> Categories Available: </div>
            <div  v-for="flag of gamedata.moveCategoryT" :key="flag"
            class="item-available">
                {{ flag }}
            </div>
        </div>
        </SearchFilter>
        <ReorderBar :data="dataList" :reorder-fields="movesReorderFields" :reorder-map="movesReorderMap" 
        @update="onReorderUpdate"/>
        <div v-bind="containerProps" class="scroll-container" >
            <div v-bind="wrapperProps">
                <template v-for="item in list" :key="item.index">
                    <RowMove :move="item.data" :height="HEIGHT_ROW"/>
                </template>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .items-available-row{
        display: flex;
        width: 100%;
        flex-wrap: wrap;
    }
    .item-available-title{
        font-size: 1.15;
        background-color: violet;
    }
    .item-available{
        padding-left: 0.5em;
        padding-right: 0.5em;
    }
</style>