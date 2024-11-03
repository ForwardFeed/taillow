<script lang="ts" setup>
import { computed, ref, type DeepReadonly } from 'vue';
import { gamedata } from '@/stores/gamedata';
import type { CompactSpecie } from '@/stores/gamedata_type';
import { STATS_LIST } from '@/data/poke_stats';
type Props = {
    specie:  DeepReadonly<CompactSpecie>,
    minHeight: number,
}
const props = withDefaults(defineProps<Props>(), {
    
})
const emits = defineEmits<{
    (e: "open-view"): void,
    (e: "close-view"):void
}>()

function openView(){
    viewState.value = !viewState.value
    if (viewState.value){
        emits("open-view")
    } else {
        emits("close-view")
    }
}
const viewState = ref()
const maxViewState = ref(0)

/**
 * The idea is that eggmoves can be a number which is a specie ID that has the eggmoves in question
 */
function getEggmoves(id: number | readonly number[]): readonly number[]{
    if (typeof id === "object")
        return id
    const targetSpecie = gamedata.value.species[id]?.mEggMoves || -1
    if (typeof targetSpecie === "object")
        return targetSpecie
    return []
}
const eggMoves = getEggmoves(props.specie.mEggMoves)

const imgSourceN = ref(0)

const imgSourceComputed = computed(()=>{
    return [
        `/img/${props.specie.NAME}.png`,
        `/img/${props.specie.NAME}_BACK.png`,
        `/img/${props.specie.NAME}_SHINY.png`,
        `/img/${props.specie.NAME}_BACK_SHINY.png`,
    ][imgSourceN.value % 4]
})
</script>
<template>
<div class="row">
    <div class="minimun-view">
        <img :src="imgSourceComputed" @click="imgSourceN++" :width="props.minHeight" class="pixelated">
        <div style="width: 9em;overflow: hidden;display: flex;">
            <span>{{ specie.name }}</span>
        </div>
        <div style="display: flex;flex-direction: column;width: 5em;">
            <div style="text-align: center;flex-grow: 1;display: flex;"
            v-for="type of specie.types.map(x => gamedata.types[x])" :key="type" :class="type.toLowerCase()">
                <span>{{ type }}</span>
            </div>
        </div>
        <div style="display: flex;width: 20em;">
            <div style="text-align: center;margin: auto;"
            v-for="ability of specie.abilities.map(x => gamedata.abilities[x].name)" :key="ability">
                {{ ability }}
            </div>
        </div>
        <div style="display: flex;width: 20em;">
            <div style="text-align: center;margin: auto;"
            v-for="ability of specie.innates.map(x => gamedata.abilities[x].name)" :key="ability">
                {{ ability }}
            </div>
        </div>
        <div style="display: flex;width: 16em;">
            <div style="margin: auto;height: 100%"  :class="STAT.toLowerCase()"
            v-for="(STAT, index) in STATS_LIST" :key="STAT">
                <div style="height: 50%;text-align: center;"> {{ STAT }} </div>
                <div style="height: 50%;text-align: center;" v-if="STAT !== 'BST'"> {{ specie.baseStats[index] }}</div>
                <div style="height: 50%;text-align: center;" v-else> {{ specie.baseStats.reduce((acc, curr)=> acc + curr) }}</div>
            </div>
        </div>
        <div style="height: 100%;display: flex;width: 3em;" >
            <button @click="openView" style="width: 100%; text-align: center">
                {{ viewState ? "hide" : "view"}}
            </button>
        </div>
    </div>
    <div class="maximum-view" v-if="viewState">
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
</div>
</template>
<style scoped>
    .row{
        flex-direction: column;
        background-color: rgb(113, 31, 221);
        width: calc(v-bind(minHeight + "px") + 9em + 5em + 20em + 20em + 16em + 3em);
        margin: auto;
        display: flex;
    }
    .minimun-view, .maximum-view{
        margin: auto;
        display: flex;
        width: 100%;
    }
    .minimun-view{
        height: v-bind(minHeight + "px");
    }
    .maximum-view{
        background-color: beige;
    }
    .sidebar{
        display: flex;
        flex-direction: column;
        width: 3em;
        background-color: rgb(70, 150, 88);
    }
    .sidebar > button{
        margin: auto;
    }
    .content-block{
        width: 100%;
        background-color: deepskyblue;
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