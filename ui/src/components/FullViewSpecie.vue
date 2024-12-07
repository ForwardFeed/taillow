<script lang="ts" setup>
import type { CompactSpecie } from '@/stores/gamedata_type';
import { gamedata } from '@/stores/gamedata';
import { evoKindToText, findEggmoves } from '@/utils/poke_utils';
import { computed, ref } from 'vue';
import { getSpecieSprite } from '@/utils/images';
import SpecieStats from './SpecieStats.vue';

type Props = {
    specie: CompactSpecie
    id: number,
}
const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits<{
    (e: "close-view"): void,
    (e: "next-specie"): void,
    (e: "prev-specie"): void
}>()

type WriteableCompactEvo = {
    in: number;
    readonly val: string;
    readonly kind: number;
}
const eggMoves = computed(()=>
    findEggmoves(gamedata.value.species, props.specie.mEggMoves)
)
const preEvos = computed(()=>{
    return props.specie.prevEvo.map(
    x => gamedata.value.species[x].evos.reduce((acc, curr)=>{
        if (curr.in === props.id){
            const currClone = structuredClone(curr) as WriteableCompactEvo
            currClone.in = x
            acc.push(currClone)
        }
            
        return acc
    }, [] as WriteableCompactEvo [])).flatMap(x => x)
})

const imgSourceN = ref(0)
const imgSourceComputed = computed(()=>{
    return getSpecieSprite(props.specie.NAME, imgSourceN.value)
})

const abilitiesStrFiltered = computed(()=>{
    return [... new Set(props.specie.abilities)].map(x => gamedata.value.abilities[x].name)
})
const innatesStrFiltered = computed(()=>{
    return [... new Set(props.specie.innates)].map(x => gamedata.value.abilities[x].name)
})


function closeView(){emits("close-view")}
function nextSpecie(){emits("next-specie")}
function prevSpecie(){emits("prev-specie")}
</script>
<template>
<div class="fullview-block bg3">
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
            <span> Abilities </span>
            <div class="abi" v-for="abi of abilitiesStrFiltered" :key="abi">
                <span> {{  abi }} </span>
            </div>
        </div>
        <div class="innates">
            <span> Innates </span>
            <div class="inn" v-for="inn of innatesStrFiltered" :key="inn">
                <span> {{  inn }} </span>
            </div>
        </div>
        <SpecieStats :specie="props.specie" />
    </div>
    <div class="main-content">
        <div class="move-list content-block">
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
        <div class="content-block">
            {{ specie.desc }}
        </div>
        <div class="content-block" v-if="preEvos.length">
            <div> Pre-Evos</div>
            <div v-for="(evo, index) in preEvos" :key="index">
                From {{ gamedata.species[evo.in].name }} {{ evoKindToText(gamedata.evoKindsT[evo.kind], evo.val) }}
            </div>
        </div>
        <div class="content-block" v-if="specie.evos.length">
            <div> Evos</div>
            <div v-for="(evo, index) in specie.evos" :key="index">
                Into {{ gamedata.species[evo.in].name }} {{ evoKindToText(gamedata.evoKindsT[evo.kind], evo.val) }}
            </div>
        </div>
    </div>
</div>
</template>
<style scoped>
.fullview-block{
    display: flex;
    flex-direction: column;
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
}
.content-block{
    width: 100%;
}

.abilities, .innates{
    height: 100%;
    width: 9em;
    display: flex;
    flex-direction: column;
}
.abi, .inn{
    display: flex;
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