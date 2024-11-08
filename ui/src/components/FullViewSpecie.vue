<script lang="ts" setup>
import type { CompactSpecie } from '@/stores/gamedata_type';
import { gamedata } from '@/stores/gamedata';
import { findEggmoves } from '@/utils/poke_utils';
import { computed, ref } from 'vue';
import { generateRGBOfStatsPercent, getLuminance, LEN_STATS_NO_BST, STATS_LIST, whiteOrBlackFontLuminance } from '@/data/poke_stats';

type Props = {
    specie: CompactSpecie
}
const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits<{
    (e: "close-view"): void,
    (e: "next-specie"): void,
    (e: "prev-specie"): void
}>()

const maxViewState = ref(0)
const eggMoves = findEggmoves(gamedata.value.species, props.specie.mEggMoves)

function closeView(){emits("close-view")}
function nextSpecie(){emits("next-specie")}
function prevSpecie(){emits("prev-specie")}

const imgSourceN = ref(0)
const imgSourceComputed = computed(()=>{
    return [
        `/img/${props.specie.NAME}.png`,
        `/img/${props.specie.NAME}_BACK.png`,
        `/img/${props.specie.NAME}_SHINY.png`,
        `/img/${props.specie.NAME}_BACK_SHINY.png`,
    ][imgSourceN.value % 4]
})

const abilitiesStrFiltered = computed(()=>{
    return [... new Set(props.specie.abilities)].map(x => gamedata.value.abilities[x].name)
})
const innatesStrFiltered = computed(()=>{
    return [... new Set(props.specie.innates)].map(x => gamedata.value.abilities[x].name)
})
const statsColors = computed(()=>{
    return props.specie.b_species_stats.map(x => generateRGBOfStatsPercent(x))  
})
//const statsFontColors = statsColors.map(({red, green, blue}) => whiteOrBlackFontLuminance(getLuminance(red, green, blue)))
const statsColorsStr = computed(()=>{
    return statsColors.value.map(({red, green, blue}, i) => `rgb(${red}, ${green}, ${blue})`)
})
const statRelToMax = computed(()=>{
    return props.specie.baseStats.map((x, i) => {
        if (i == LEN_STATS_NO_BST){
            return props.specie.b_species_stats[LEN_STATS_NO_BST].toFixed(1)
        }
        return ((x / 255)*100).toFixed(1)
    })
})
</script>
<template>
<div class="fullview-block">
    <div class="return-list">
        
    </div>
    <div class="controls-row">
        <button class="control" @click="prevSpecie()">
            ↑ prev specie
        </button>
        <button class="control" @click="nextSpecie()">
            ↓ next specie
        </button>
        <button class="control" @click="closeView()">
            ← Return to list
        </button>
    </div>
    <div class="top-content">
        <img :src="imgSourceComputed" class="pixelated" style="width: 10em;height: 10em;" @click="imgSourceN++">
        <div class="abilities">
            <div class="abi" v-for="abi of abilitiesStrFiltered" :key="abi">
                <span> {{  abi }} </span>
            </div>
        </div>
        <div class="innates">
            <div class="innate" v-for="inn of innatesStrFiltered" :key="inn">
                <span> {{  inn }} </span>
            </div>
        </div>
        <div class="stats-block">
            <div class="stat-row" v-for="(stat, index) in specie.baseStats" :key="index">
                <span class="stat-name"> {{ STATS_LIST[index] }} </span>
                <span class="stat-num" :style="`background-color: ${statsColorsStr[index]}`">{{ stat }}</span>
                <div class="stat-bar" :style="`background: linear-gradient(to right, ${statsColorsStr[index]} ${statRelToMax[index]}%, rgba(0, 0, 0, 0) 0%);`">

                </div>
            </div>
        </div>
    </div>
    <div class="main-content">
        <div class="move-list content-block" v-if="maxViewState == 0">
                <div class="move-col" v-if="specie.mLevel.length">
                    <div class="move-col-title"><span>Learnset</span></div>
                    <div :class="gamedata.types[gamedata.moves[id].type].toLowerCase() + ' move-row'"
                    v-for="{id, lvl} of specie.mLevel" :key="id"> 
                        <span> {{ gamedata.moves[id].name }}</span>
                        <span class="move-level"> {{ lvl }} </span>
                    </div>
                </div>
                <div class="move-col" v-if="specie.mTMHM.length">
                    <div class="move-col-title"><span>TMHM</span></div>
                    <div :class="gamedata.types[gamedata.moves[moveID].type].toLowerCase() + ' move-row'"
                    v-for="moveID of specie.mTMHM" :key="moveID">
                    <span>{{ gamedata.moves[moveID].name}}</span>
                    </div>
                </div>
                <div class="move-col" v-if="specie.mTutors.length">
                    <div class="move-col-title"><span>Tutor</span></div>
                    <div :class="gamedata.types[gamedata.moves[moveID].type].toLowerCase() + ' move-row'"
                    v-for="moveID of specie.mTutors" :key="moveID">
                        <span>{{ gamedata.moves[moveID].name}}</span>
                    </div>
                </div>
                <div class="move-col" v-if="eggMoves.length">
                    <div class="move-col-title"><span>Eggmoves</span></div>
                    <div :class="gamedata.types[gamedata.moves[moveID].type].toLowerCase() + ' move-row'"
                    v-for="moveID of eggMoves" :key="moveID">
                       <span>{{ gamedata.moves[moveID].name}}</span>
                    </div>
                </div>
            </div>
            <div class="content-block" v-else-if="maxViewState == 1">
                {{ specie.desc }}
            </div>
            <div class="content-block" v-else-if="maxViewState == 2">
                Sets
            </div>
    </div>
    <div class="sidebar">
        <button @click="maxViewState = 0">Moves</button>
        <button @click="maxViewState = 1">Misc</button>
        <button @click="maxViewState = 2">Sets</button>
    </div>
</div>
</template>
<style scoped>
.fullview-block{
    display: flex;
    flex-direction: column;
    background-color: yellow;
    position: relative;
    height: 100%;
}
.controls-row{
    display: flex;
}
.control{
    margin: auto;
}
.top-content{
    height: 10em;
    display: flex;
}
.main-content{
    flex-grow: 1;
    background-color: rgb(41, 138, 21);
}
.sidebar{
    display: flex;
    flex-direction: column;
    width: 5em;
    background-color: rgb(70, 150, 88);
}
.sidebar > button{
    margin: auto;
}
.content-block{
    width: 100%;
    background-color: deepskyblue;
}
.stats-block{
    display: flex;
    flex-grow: 1;
    flex-direction: column;
}
.stat-row{
    flex-grow: 1;
    display: flex;
    position: relative;
}
.stat-name{
    width: 3em;
    height: 100%;
}
.stat-num{
    width: 3em;
    height: 100%;
    text-align: center;
}
.stat-bar{
    flex-grow: 1;
}
.move-col{
    flex-grow: 1;
    display: flex;
    flex-wrap: wrap;
}
.move-col-title{
    display: flex;
    width: 100%;
}
.move-list{
    display: flex;
}
.move-row{
    width: 12em;
    padding-top: 0.1em;
    padding-bottom: 0.1em;
    display: flex;
}
.move-level{
    margin-right: 0;
}
</style>