<script lang="ts" setup>
import RowMove from '@/components/RowMove.vue';
import { movesFilterMap, movesReorderFields, movesReorderMap, movesFilterFields, type MovesReorderFields } from '@/data/search/moves';
import { gamedata } from '@/stores/gamedata';
import { useVirtualList } from '@vueuse/core';
import { markRaw, ref } from 'vue';
import SearchFilter from '@/components/SearchFilter.vue'
import ReorderBar, { type FullField } from '@/components/ReorderBar.vue';

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
// its a bit unsafe but w/e
const fullFieldsOrder: FullField<MovesReorderFields>[] = [
    {
        field: "name",
        width: "9em"
    },
    {
        field: "power",
        str: "pwr",
        width: "4em"
    },
    {
        field: "acc",
        width: "4em"
    },
    {
        field: "prio",
        width: "4em"
    },
    {
        field: "type",
        width: "7em"
    },
    {
        field: "category",
        width: "7em"
    },
    {
        field: "chance",
        str: "luck",
        width: "4em"
    },
    {
        field: "critStage",
        str: "crit",
        width: "4em"
    },
    {
        field: "strikeCount",
        str: "cnt",
        width: "4em"
    },
    {
        field: "pp",
        width: "4em"
    },
    {
        field: "description",
        width: ";flex-grow: 1;" // a bit of a hack lol
    }
]

</script>
<template>
    <div class="g-virtual-list-container-parent">
        <SearchFilter :filterFields="movesFilterFields" :data="dataList"
        @update="onSearchFilterUpdate" :filter-map="movesFilterMap">
        <div class="items-available-row">
            <div class="item-available-title bg3"> Moves Flags Available: </div>
            <div  v-for="flag of gamedata.moveFlagsT" :key="flag"
            class="item-available">
                {{ flag }}
            </div>
        </div>
        <div class="items-available-row">
            <div class="item-available-title bg3"> Moves Flags Ban Available: </div>
            <div  v-for="flag of gamedata.moveFlagsBanT" :key="flag"
            class="item-available">
                {{ flag }}
            </div>
        </div>
        <div class="items-available-row">
            <div class="item-available-title bg3"> Categories Available: </div>
            <div  v-for="flag of gamedata.moveCategoryT" :key="flag"
            class="item-available">
                {{ flag }}
            </div>
        </div>
        </SearchFilter>
        <ReorderBar :data="dataList" :reorder-fields="movesReorderFields" :reorder-map="movesReorderMap" 
        @update="onReorderUpdate" :full-fields="fullFieldsOrder" />
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
    }
    .item-available{
        padding-left: 0.5em;
        padding-right: 0.5em;
    }
</style>