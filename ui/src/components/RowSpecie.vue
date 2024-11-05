<script lang="ts" setup>
import { computed, ref, type DeepReadonly } from 'vue';
import { gamedata } from '@/stores/gamedata';
import type { CompactSpecie } from '@/stores/gamedata_type';
import { STATS_LIST, generateColorOfStatsPercent } from '@/data/poke_stats';

type Props = {
    specie:  DeepReadonly<CompactSpecie>,
    specieIndex: number,
    minHeight: number,
}
const props = withDefaults(defineProps<Props>(), {
    
})
const emits = defineEmits<{
    (e: "open-view"): void,
}>()

const imgSourceN = ref(0)
const imgSourceComputed = computed(()=>{
    return [
        `/img/${props.specie.NAME}.png`,
        `/img/${props.specie.NAME}_BACK.png`,
        `/img/${props.specie.NAME}_SHINY.png`,
        `/img/${props.specie.NAME}_BACK_SHINY.png`,
    ][imgSourceN.value % 4]
})

function openView(){
    emits("open-view")
}
const colorsStatsCSS = gamedata.value.b_species_stats[props.specieIndex]?.map(x => generateColorOfStatsPercent(x))
</script>
<template>
<div class="row">
    <img :src="imgSourceComputed" @click="imgSourceN++" :width="props.minHeight" class="pixelated">
    <div style="width: 9em;overflow: hidden;display: flex;">
        <span>{{ specie.name }}</span>
    </div>
    <div style="display: flex;flex-direction: column;width: 5em;">
        <div style="text-align: center;flex-grow: 1;display: flex;"
        v-for="(type, index) of specie.types.map(x => gamedata.types[x])" :key="index" :class="type.toLowerCase()">
            <span>{{ type }}</span>
        </div>
    </div>
    <div style="display: flex;width: 20em;">
        <div style="text-align: center;margin: auto;"
        v-for="(ability, index) of specie.abilities.map(x => gamedata.abilities[x]?.name)" :key="index">
            {{ ability }}
        </div>
    </div>
    <div style="display: flex;width: 20em;">
        <div style="text-align: center;margin: auto;"
        v-for="(ability, index) of specie.innates.map(x => gamedata.abilities[x]?.name)" :key="index">
            {{ ability }}
        </div>
    </div>
    <div style="display: flex;width: 16em;">
        <div :style="colorsStatsCSS ? colorsStatsCSS[index] : ''"
        :class="`${STAT.toLowerCase()} stat-col`"
        v-for="(STAT, index) in STATS_LIST" :key="STAT">
            <div style="height: 50%;text-align: center;"> {{ STAT }} </div>
            <div style="height: 50%;text-align: center;" v-if="STAT !== 'BST'"> {{ specie.baseStats[index] }}</div>
            <div style="height: 50%;text-align: center;" v-else> {{ specie.baseStats.reduce((acc, curr)=> acc + curr) }}</div>
        </div>
    </div>
    <div style="height: 100%;display: flex;width: 3em;" >
        <button @click="openView" style="width: 100%; text-align: center">
            view
        </button>
    </div>
</div>
</template>
<style scoped>
.row{
    background-color: rgb(113, 31, 221);
    width: calc(v-bind(minHeight + "px") + 9em + 5em + 20em + 20em + 16em + 3em);
    height: v-bind(minHeight + "px");
    margin: auto;
    display: flex;
}
.stat-col{
    margin: auto;
    height: 100%;
}
</style>