<script lang="ts" setup>
import { ref, type DeepReadonly } from 'vue';
import { gamedata } from '@/stores/gamedata';
import type { CompactSpecie } from '@/stores/gamedata_type';
type Props = {
    specie:  DeepReadonly<CompactSpecie>
}
const props = withDefaults(defineProps<Props>(), {
    
})
function openView(){
    viewState.value = !viewState.value
    console.log("hide")
}
const viewState = ref(false)
const maxViewState = ref(0)

/**
 * The idea is that eggmoves can a number which is a specie ID that has the eggmoves in question
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
</script>
<template>
<div class="row">
    <div class="minimun-view">
        <img :src="`/img/${specie.NAME}.png`">
        <div> {{ specie.name }}</div>
        <div> {{ specie.types.map(x => gamedata.types[x]) }}</div>
        <div>
            <button @click="openView">
                {{ viewState ? "hide" : "view"}}
            </button>
        </div>
    </div>
    <div class="maximum-view" v-if="viewState">
        <div class="main-content">
            <div class="move-list content-block" v-if="maxViewState == 0">
                <div class="move-col" v-if="specie.mLevel.length">
                    <div class="move-col-title"><span>Learnset</span></div>
                    <div class="move-row" v-for="{id, lvl} of specie.mLevel" :key="id">
                        <span> {{ gamedata.moves[id].name }}</span>
                        <span class="move-level"> {{ lvl }} </span>
                    </div>
                </div>
                <div class="move-col" v-if="specie.mTMHM.length">
                    <div class="move-col-title"><span>TMHM</span></div>
                    <div class="move-row" v-for="moveID of specie.mTMHM" :key="moveID">
                        {{ gamedata.moves[moveID].name}}
                    </div>
                </div>
                <div class="move-col" v-if="specie.mTutors.length">
                    <div class="move-col-title"><span>Tutor</span></div>
                    <div class="move-row" v-for="moveID of specie.mTutors" :key="moveID">
                        {{ gamedata.moves[moveID].name}}
                    </div>
                </div>
                <div class="move-col" v-if="eggMoves.length">
                    <div class="move-col-title"><span>Eggmoves</span></div>
                    <div class="move-row" v-for="moveID of eggMoves" :key="moveID">
                        {{ gamedata.moves[moveID].name}}
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
    }
    .row, .minimun-view, .maximum-view{
        width: 100%;
        display: flex;
    }
    .minimun-view{
        background-color: rgb(113, 31, 221);
    }
    .maximum-view{
        background-color: beige;
        z-index: 0;
        height: 30em;
    }
    .sidebar{
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 4em;
        background-color: rgb(70, 150, 88);
    }
    .sidebar > button{
        margin: auto;
    }
    .main-content{
        flex-grow: 1;
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
        display: flex;
    }
    .move-level{
        margin-right: 0;
    }
   
</style>