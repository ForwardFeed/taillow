<script lang="ts" setup>
import { computed, ref, type DeepReadonly } from 'vue';
import { gamedata } from '@/stores/gamedata';
import type { CompactSpecie } from '@/stores/gamedata_type';
import { STATS_LIST, generateRGBOfStatsPercent, getLuminance, whiteOrBlackFontLuminance } from '@/data/poke_stats';
import { getSpecieSprite } from '@/utils/images';

type Props = {
    specie:  DeepReadonly<CompactSpecie>,
    minHeight: number,
}
const props = withDefaults(defineProps<Props>(), {
    
})
const emits = defineEmits<{
    (e: "open-view"): void,
}>()

const imgSourceN = ref(0)
const imgSourceComputed = computed(()=>{
    return getSpecieSprite(props.specie.NAME, imgSourceN.value)
})

const abilitiesStrFiltered = computed(()=>{
    return [... new Set(props.specie.abilities)].map(x => gamedata.value.abilities[x]?.name)
})
const innatesStrFiltered = computed(()=>{
    return [... new Set(props.specie.innates)].map(x => gamedata.value.abilities[x]?.name)
})

function openView(){
    emits("open-view")
}
const statsColors = props.specie.b_species_stats.map(x => generateRGBOfStatsPercent(x))  
const statsFontColors = statsColors.map(({red, green, blue}) => whiteOrBlackFontLuminance(getLuminance(red, green, blue)))
const statsColorsStr = statsColors.map(({red, green, blue}, i) => `background-color: rgb(${red},${green},${blue});color: ${statsFontColors[i]}`)

</script>
<template>
<div class="row">
    <img :src="imgSourceComputed" @click="imgSourceN++" :width="props.minHeight" class="pixelated">
    <div style="width: 9em;overflow: hidden;display: flex;">
        <span>{{ specie.name }}</span>
    </div>
    <div style="display: flex;flex-direction: column;width: 6em;">
        <div style="text-align: center;flex-grow: 1;display: flex;"
        v-for="(type, index) of specie.types.map(x => gamedata.types[x])" :key="index" :class="type.toLowerCase()">
            <span>{{ type }}</span>
        </div>
    </div>
    <div style="display: flex;width: 20em;">
        <div style="text-align: center;margin: auto;"
        v-for="(ability, index) of abilitiesStrFiltered" :key="index">
            {{ ability }}
        </div>
    </div>
    <div style="display: flex;width: 20em;">
        <div style="text-align: center;margin: auto;"
        v-for="(ability, index) of innatesStrFiltered" :key="index">
            {{ ability }}
        </div>
    </div>
    <div style="display: flex;">
        <div :style="statsColorsStr[index]"
        :class="`${STAT.toLowerCase()} stat-col`"
        v-for="(STAT, index) in STATS_LIST" :key="STAT">
            <div style="height: 50%;text-align: center;"> {{ STAT }} </div>
            <div style="height: 50%;text-align: center;"> {{ specie.baseStats[index] }}</div>
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
    width: fit-content;
    height: v-bind(minHeight + "px");
    margin: auto;
    display: flex;
}
.stat-col{
    margin: auto;
    height: 100%;
    flex-grow: 1;
    width: 3em;
}
</style>