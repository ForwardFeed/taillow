<script lang="ts" setup>
import { useVirtualList } from '@vueuse/core'
import { gamedata } from '@/stores/gamedata';
import { markRaw, onMounted, ref, watch} from 'vue';
import SpecieRow from '@/components/SpecieRow.vue';
import SearchFilterReorder from '@/components/SearchFilterReorder.vue';
import { speciesFilterMap, speciesSearchFields, speciesReorderMap } from '@/data/search/species';
import { useRoute } from 'vue-router';
import router from '@/router';

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
        
        target.scrollTo({
            top: +route.params.id * 64
        })
    }
    
})

function changeURL(id?: number){
    if (id){
        router.push({ name: route.name, params: { id: id}})
    } else {
        router.push({ name: route.name})
    }
    
}
</script>
<template>

<div class="scroll-container-parent">
    <SearchFilterReorder :searchFields="speciesSearchFields" :data="listb" @update="onDataUpdate" :filter-map="speciesFilterMap" :reorder-map="speciesReorderMap">
        
    </SearchFilterReorder>
    <div v-bind="containerProps" class="scroll-container" >
        <div v-bind="wrapperProps">
            <template v-for="item in list" :key="item.index">
                <SpecieRow :specie="item.data" style="height: 64px" @open-view="changeURL(item.index)" @close-view="changeURL()">
                </SpecieRow>
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
    overflow-y: scroll;
    height: 100vh;
}
.scroll-bar{
    width: 1em;
    background-color: red;
}

.scroll-container{
    height: fit-content;
}
</style>