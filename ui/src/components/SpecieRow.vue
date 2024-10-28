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

function getEggmoves(id: number | readonly number[]): readonly number[]{
    if (typeof id === "object")
        return id
    const targetSpecie = gamedata.species[id]?.mEggMoves || -1
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
        <div class="move-list">
            <div class="move-col" v-if="specie.mLevel.length">
                <div class="move-col-title">learnset</div>
                <div class="move-row" v-for="moveID of specie.mLevel" :key="moveID.id">
                    {{ gamedata.moves[moveID.id].name}} at {{ moveID.lvl }}
                </div>
            </div>
            <div class="move-col" v-if="specie.mTMHM.length">
                <div class="move-col-title">TMHM</div>
                <div class="move-row" v-for="moveID of specie.mTMHM" :key="moveID">
                    {{ gamedata.moves[moveID].name}}
                </div>
            </div>
            <div class="move-col" v-if="specie.mTutors.length">
                <div class="move-col-title">Tutor</div>
                <div class="move-row" v-for="moveID of specie.mTutors" :key="moveID">
                    {{ gamedata.moves[moveID].name}}
                </div>
            </div>
            <div class="move-col" v-if="eggMoves.length">
                <div class="move-col-title">Eggmoves</div>
                <div class="move-row" v-for="moveID of eggMoves" :key="moveID">
                    {{ gamedata.moves[moveID].name}}
                </div>
            </div>
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
    .maximum-view{
        background-color: beige;
        z-index: 0;
    }
    .move-list{
        display: flex;
    }
</style>