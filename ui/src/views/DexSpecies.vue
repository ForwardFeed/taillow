<script lang="ts" setup>
import { useVirtualList } from '@vueuse/core'
import { gamedata } from '@/stores/gamedata';
import { markRaw, onMounted, ref} from 'vue';
import RowSpecie from "@/components/RowSpecie.vue"
import { speciesFilterMap, speciesSearchFields, speciesReorderMap } from '@/data/search/species';
import { useRoute } from 'vue-router';
import router from '@/router';
import { useVersionStore } from '@/stores/versions';
import SearchFilterReorder2 from '@/components/SearchFilterReorder2.vue';

const route = useRoute()

const dataListRef = ref(markRaw(gamedata.value.species))
const dataList = gamedata.value.species
const HEIGHT_ROW = 96

const { list, containerProps, wrapperProps } = useVirtualList(
    dataListRef ,
    {
        itemHeight: HEIGHT_ROW,
    },
)

function onDataUpdate(indexes: number[]){
    dataListRef.value = indexes.map(x => gamedata.value.species[x])
}
// share the gameversion so the param.id is the right offset
if (route.query["gv"] && typeof route.query["gv"] === "string"){
    const versionStore = useVersionStore()
    versionStore.changeVersion(route.query["gv"])
}
//const searchFilterReorderExposed = useTemplateRef<ComponentExposed<typeof SearchFilterReorder>>('search-filter-reorder')
onMounted(()=>{
    if (!route.params.id)
        return
    
    const target = containerProps.ref.value as HTMLElement
    if (typeof route.params.id === "string"){
        
        target.scrollTo({
            top: +route.params.id * HEIGHT_ROW
        })
    }
    
})
// change the URL and adapt the size of scroll
function openView(id?: number){
    
    if (id !== undefined){
        const versionStore = useVersionStore()
        router.push({ name: route.name, params: { id: id}, query: {gv: versionStore.chosenVersionName}})
    } else {
        router.push({ name: route.name})
    }
}


</script>
<template>

<div class="scroll-container-parent">
    <SearchFilterReorder2 :searchFields="speciesSearchFields" :data="dataList" ref="search-filter-reorder" 
@update="onDataUpdate" :filter-map="speciesFilterMap" :reorder-map="speciesReorderMap">
        
    </SearchFilterReorder2>
    <div v-bind="containerProps" class="scroll-container" >
        <div v-bind="wrapperProps">
            <template v-for="item in list" :key="item.index">
                <RowSpecie :specie="item.data" @open-view="openView(item.index)" @close-view="openView()"
                :min-height="HEIGHT_ROW">
                </RowSpecie>
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
    background-color: springgreen;
}
</style>