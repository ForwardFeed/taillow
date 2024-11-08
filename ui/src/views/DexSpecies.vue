<script lang="ts" setup>
import { useVirtualList } from '@vueuse/core'
import { gamedata } from '@/stores/gamedata';
import { markRaw, onMounted, ref} from 'vue';
import RowSpecie from "@/components/RowSpecie.vue"
import { speciesFilterMap, speciesFilterFields, speciesReorderMap, speciesReorderFields } from '@/data/search/species';
import { useRoute } from 'vue-router';
import router from '@/router';
import { useVersionStore } from '@/stores/versions';
import SearchFilter from '@/components/SearchFilter.vue';
import FullViewSpecie from '@/components/FullViewSpecie.vue';
import ReorderBar from '@/components/ReorderBar.vue';

const route = useRoute()

const dataListRef = ref(markRaw(gamedata.value.species))
const dataList = gamedata.value.species
const HEIGHT_ROW = 96
const IsFullView = ref(false)
const fullViewSpecie = ref(gamedata.value.species[0])
const { list, containerProps, wrapperProps } = useVirtualList(
    dataListRef ,
    {
        itemHeight: HEIGHT_ROW,
    },
)
let reorderIndexes = [...Array(dataList.length).keys()]
let filterIndexes = [...Array(dataList.length).keys()]
let currSpecieID = 0

function onUpdate(){
    dataListRef.value = reorderIndexes.reduce(function(filtered, current){
        if (~filterIndexes.indexOf(current)){
            filtered.push(current)
        }
        return filtered
    }, [] as number[]).map(x => gamedata.value.species[x])
}

function onReorderUpdate(indexes: number[]){
    reorderIndexes = indexes
    onUpdate()
}

function onSearchFilterUpdate(indexes: number[]){
    filterIndexes = indexes
    onUpdate()
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
        const id = +route.params.id
        if(isNaN(id))
            return
        target.scrollTo({
            top: id * HEIGHT_ROW
        })
        fullViewSpecie.value = gamedata.value.species[id]
        IsFullView.value = true;
    }
    
})
// change the URL, adapt the size of scroll and open the full view of the target
function openView(id: number){
    currSpecieID = id
    const versionStore = useVersionStore()
    router.push({ name: route.name, params: { id: id}, query: {gv: versionStore.chosenVersionName}})
    fullViewSpecie.value = gamedata.value.species[id]
    IsFullView.value = true
}
function closeView(){
    router.push({ name: route.name})
    IsFullView.value = false
}
function prevSpecie(){
    currSpecieID = Math.max(currSpecieID - 1, 0)
    const versionStore = useVersionStore()
    router.push({ name: route.name, params: { id: currSpecieID}, query: {gv: versionStore.chosenVersionName}})
    fullViewSpecie.value = gamedata.value.species[currSpecieID]
}
function nextSpecie(){
    currSpecieID = Math.min(currSpecieID + 1, dataList.length - 1)
    const versionStore = useVersionStore()
    router.push({ name: route.name, params: { id: currSpecieID}, query: {gv: versionStore.chosenVersionName}})
    fullViewSpecie.value = gamedata.value.species[currSpecieID]
}



</script>
<template>

<div class="g-virtual-list-container-parent">
    <SearchFilter :filterFields="speciesFilterFields" :data="dataList" 
    @update="onSearchFilterUpdate" :filter-map="speciesFilterMap" :reorder-map="speciesReorderMap">
        <ReorderBar :data="dataList" :reorder-fields="speciesReorderFields" :reorder-map="speciesReorderMap"
        @update="onReorderUpdate" />
    </SearchFilter>

    <div v-bind="containerProps" class="scroll-container" v-show="!IsFullView">
        <div v-bind="wrapperProps">
            <template v-for="item in list" :key="item.index">
                <RowSpecie :specie="item.data" @open-view="openView(item.index)"
                :min-height="HEIGHT_ROW">
                </RowSpecie>
            </template>
        </div>
    </div>
    <FullViewSpecie v-if="IsFullView" :specie="fullViewSpecie" 
    @close-view="closeView()" @next-specie="nextSpecie" @prev-specie="prevSpecie"/>
</div>


</template>
<style scoped>

.scroll-bar{
    width: 1em;
    background-color: red;
}

.scroll-container{
    height: fit-content;
}
</style>