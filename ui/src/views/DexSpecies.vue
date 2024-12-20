<script lang="ts" setup>
import { useVirtualList } from '@vueuse/core'
import { gamedata } from '@/stores/gamedata';
import { computed, markRaw, onMounted, ref, watch} from 'vue';
import RowSpecie from "@/components/RowSpecie.vue"
import { speciesFilterMap, speciesFilterFields, speciesReorderMap, speciesReorderFields, type SpecieReorderFields } from '@/data/search/species';
import { useRoute } from 'vue-router';
import router from '@/router';
import { useVersionStore } from '@/stores/versions';
import SearchFilter from '@/components/SearchFilter.vue';
import FullViewSpecie from '@/components/FullViewSpecie.vue';
import ReorderBar, { type FullField } from '@/components/ReorderBar.vue';

const route = useRoute()

const dataListRef = ref(markRaw(gamedata.value.species))
const dataList = gamedata.value.species
const HEIGHT_ROW = 96
const IsFullView = ref(false)
const currSpecieID = ref(0)
const fullViewSpecie = computed(()=>gamedata.value.species[currSpecieID.value])

const { list, containerProps, wrapperProps } = useVirtualList(
    dataListRef ,
    {
        itemHeight: HEIGHT_ROW,
    },
)
let reorderIndexes = [...Array(dataList.length).keys()]
let filterIndexes = [...Array(dataList.length).keys()]

// because the app will often load before the data loads
watch(gamedata, ()=>{
    dataListRef.value = markRaw(gamedata.value.species)
})

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

function adaptToRouteChange(){
    if (!route.params.id){
        IsFullView.value = false;
        return
    }
    const target = containerProps.ref.value as HTMLElement
    if (typeof route.params.id === "string"){
        const id = +route.params.id
        if(isNaN(id))
            return
        target.scrollTo({
            top: id * HEIGHT_ROW
        })
        IsFullView.value = true;
        currSpecieID.value = id
    }
}
onMounted(()=>{
    adaptToRouteChange()
})
watch(()=> route.params.id, ()=>{
    adaptToRouteChange()
})
// change the URL, adapt the size of scroll and open the full view of the target
function openView(id: number){
    currSpecieID.value = id
    const versionStore = useVersionStore()
    router.push({ name: route.name, params: { id: id}, query: {v: versionStore.chosenVersionName}})
    IsFullView.value = true
}
function closeView(){
    router.push({ name: route.name})
    IsFullView.value = false
}
function prevSpecie(){
    currSpecieID.value = Math.max(currSpecieID.value - 1, 0)
    const versionStore = useVersionStore()
    router.push({ name: route.name, params: { id: currSpecieID.value}, query: {v: versionStore.chosenVersionName}})
}
function nextSpecie(){
    currSpecieID.value = Math.min(currSpecieID.value + 1, dataList.length - 1)
    const versionStore = useVersionStore()
    router.push({ name: route.name, params: { id: currSpecieID.value}, query: {v: versionStore.chosenVersionName}})
}

// its a bit unsafe but w/e*
//wtf 9em here isn't the same as 9em under what in the world, whaaaat???????
const fullFieldsOrder: FullField<SpecieReorderFields>[] = [
    {
        field: "",
        width: ";flex-grow: 1"
    },
    {
        field: "sprite",
        width: `${HEIGHT_ROW}px`
    },
    {
        field: "name",
        width: "9em" 
    },
    {
        field: "type",
        width: "6em"
    },
    {
        field: "abilities",
        width: "20em"
    },
    {
        field: "innates",
        width: "20em"
    },
    {
        field: "HP",
        str: "H.P",
        width: "3em"
    },
    {
        field: "ATK",
        width: "3em"
    },
    {
        field: "DEF",
        width: "3em"
    },
    {
        field: "SPA",
        width: "3em"
    },
    {
        field: "SPD",
        width: "3em"
    },
    {
        field: "SPE",
        width: "3em"
    },
    {
        field: "BST",
        width: "3em"
    },
    {
        field: "",
        width: "3em"
    },
    {
        field: "",
        width: ";flex-grow: 1"
    },
]

</script>
<template>

<div class="g-virtual-list-container-parent">
    <SearchFilter :filterFields="speciesFilterFields" :data="dataList" 
    @update="onSearchFilterUpdate" :filter-map="speciesFilterMap" :reorder-map="speciesReorderMap">
        <ReorderBar :data="dataList" :reorder-fields="speciesReorderFields" :reorder-map="speciesReorderMap"
        @update="onReorderUpdate" :full-fields="fullFieldsOrder"/>
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
    <FullViewSpecie v-if="IsFullView" :specie="fullViewSpecie" :id="currSpecieID" 
    @close-view="closeView()" @next-specie="nextSpecie" @prev-specie="prevSpecie"/>
</div>


</template>
<style scoped>
.scroll-container{
    height: fit-content;
}
</style>