<script lang="ts" setup>
import RowAbility from '@/components/RowAbility.vue';
import { abilitiesFilterMap, abilitiesReorderMap, abilitiesSearchFields } from '@/data/search/abilities';
import { gamedata } from '@/stores/gamedata';
import { useVirtualList } from '@vueuse/core';
import { ref, markRaw } from 'vue';
import SearchFilterReorder2 from '@/components/SearchFilterReorder2.vue'

const dataListRef = ref(markRaw(gamedata.value.abilities))
const dataList = gamedata.value.abilities
const HEIGHT_ROW = 64

const { list, containerProps, wrapperProps } = useVirtualList(
    dataListRef ,
    {
        itemHeight: HEIGHT_ROW,
    },
)
function onDataUpdate(indexes: number[]){
    dataListRef.value = indexes.map(x => gamedata.value.abilities[x])
}

</script>
<template>
    <div class="g-virtual-list-container-parent">
    <SearchFilterReorder2 :searchFields="abilitiesSearchFields" :data="dataList" ref="search-filter-reorder" 
@update="onDataUpdate" :filter-map="abilitiesFilterMap" :reorder-map="abilitiesReorderMap">
        
    </SearchFilterReorder2>
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