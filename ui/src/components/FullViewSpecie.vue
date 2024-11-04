<script lang="ts" setup>
import type { CompactSpecie } from '@/stores/gamedata_type';
import { gamedata } from '@/stores/gamedata';
import { findEggmoves } from '@/utils/poke_utils';
import { ref } from 'vue';

type Props = {
    specie: CompactSpecie
}
const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits<{
    (e: "close-view"): void
}>()

const maxViewState = ref(0)
const eggMoves = findEggmoves(gamedata.value.species, props.specie.mEggMoves)

function closeView(){
    emits("close-view")
}
</script>
<template>
<div class="fullview-block">
    <div class="return-list">
        <button  @click="closeView()">
            ← Return to list
        </button>
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
    background-color: yellow;
    position: relative;
    height: 100%;
}
.return-list{
    position: absolute;
    top: 0;
    right: 0;
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