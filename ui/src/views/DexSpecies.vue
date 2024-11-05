<script lang="ts" setup>
import { useVirtualList } from '@vueuse/core'
import { gamedata } from '@/stores/gamedata';
import { markRaw, onMounted, ref} from 'vue';
import RowSpecie from "@/components/RowSpecie.vue"
import { speciesFilterMap, speciesSearchFields, speciesReorderMap, speciesReorderFields } from '@/data/search/species';
import { useRoute } from 'vue-router';
import router from '@/router';
import { useVersionStore } from '@/stores/versions';
import SearchFilterReorder2 from '@/components/SearchFilterReorder2.vue';
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
    }
    
})
// change the URL, adapt the size of scroll and open the full view of the target
function openView(id: number){
    const versionStore = useVersionStore()
    router.push({ name: route.name, params: { id: id}, query: {gv: versionStore.chosenVersionName}})
    fullViewSpecie.value = gamedata.value.species[id]
    IsFullView.value = true
}
function closeView(){
    router.push({ name: route.name})
    IsFullView.value = false
}

</script>
<template>

<div class="g-virtual-list-container-parent">
    <SearchFilterReorder2 :searchFields="speciesSearchFields" :data="dataList" ref="search-filter-reorder" 
    @update="onSearchFilterUpdate" :filter-map="speciesFilterMap" :reorder-map="speciesReorderMap"/>
    <ReorderBar :data="dataList" :reorder-fields="speciesReorderFields" :reorder-map="speciesReorderMap"
    @update="onReorderUpdate" />
    <div v-bind="containerProps" class="scroll-container" v-show="!IsFullView">
        <div v-bind="wrapperProps">
            <template v-for="item in list" :key="item.index">
                <RowSpecie :specie="item.data" @open-view="openView(item.index)"
                :min-height="HEIGHT_ROW">
                </RowSpecie>
            </template>
        </div>
    </div>
    <FullViewSpecie v-if="IsFullView" :specie="fullViewSpecie" @close-view="closeView()" />
</div>


</template>
<style scoped>
.g-virtual-list-container-parent{
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    height: 100vh;
    background-color: springgreen;
}
.scroll-bar{
    width: 1em;
    background-color: red;
}

.scroll-container{
    height: fit-content;
}
</style>