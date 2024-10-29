<script lang="ts" setup>
import { useVirtualList } from '@vueuse/core'
import { gamedata } from '@/stores/gamedata';
import { markRaw, onMounted, ref, watch} from 'vue';
import SpecieRow from '@/components/SpecieRow.vue';
import SearchFilterReorder from '@/components/SearchFilterReorder.vue';
import { speciesFilterMap, speciesSearchFields, speciesReorderMap } from '@/data/search/species';
import { useRoute } from 'vue-router';

const route = useRoute()

const lista = ref(markRaw(gamedata.value.species.slice(0, 400)))

const listb = gamedata.value.species.slice(0, 400)

const { list, containerProps, wrapperProps } = useVirtualList(
    lista ,
    {
        itemHeight: 64,
    },
)

function onDataUpdate(indexes: number[]){
    lista.value = indexes.map(x => gamedata.value.species[x])
}

onMounted(()=>{
    if (!route.params.id)
        return

    const target = containerProps.ref.value as HTMLElement
    if (typeof route.params.id === "string"){
        
        setTimeout(function () {
            target.scrollTo({
                top: +route.params.id * 64
            })
            console.log(+route.params.id * 64)
        },2000);
    }
})
</script>
<template>

<div class="scroll-container-parent">
    <SearchFilterReorder :searchFields="speciesSearchFields" :data="listb" @update="onDataUpdate" :filter-map="speciesFilterMap" :reorder-map="speciesReorderMap">
        
    </SearchFilterReorder>
    <div v-bind="containerProps" class="scroll-container" >
        <div v-bind="wrapperProps">
            <template v-for="item in list" :key="item.index">
                <SpecieRow :specie="item.data" style="height: 64px"></SpecieRow>
            </template>
        </div>
    </div>
</div>


</template>
<style scoped>
.scroll-container-parent{
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}
.scroll-bar{
    width: 1em;
    background-color: red;
}
</style>