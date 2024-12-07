<script lang="ts" setup>
import { generateRGBOfStatsPercent, getLuminance, LEN_STATS_NO_BST, STATS_LIST, whiteOrBlackFontLuminance } from '@/data/poke_stats';
import type { CompactSpecie } from '@/stores/gamedata_type';
import { computed } from 'vue';

type Props = {
    specie: CompactSpecie
}
const props = withDefaults(defineProps<Props>(), {})
const statsColors = computed(()=>{
    return props.specie.b_species_stats.map(x => generateRGBOfStatsPercent(x))  
})
const statsFontColors = computed(()=>{
    return statsColors.value.map(({red, green, blue}) => whiteOrBlackFontLuminance(getLuminance(red, green, blue)))
})
const statsColorsStr = computed(()=>{
    return statsColors.value.map(({red, green, blue}) => `rgb(${red}, ${green}, ${blue})`)
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
<div class="stats-block">
            <div class="stat-row" v-for="(stat, index) in specie.baseStats" :key="index">
                <span class="stat-name"> {{ STATS_LIST[index] }} </span>
                <span class="stat-num" :style="`background-color: ${statsColorsStr[index]}; color: ${statsFontColors[index]}`">{{ stat }}</span>
                <div class="stat-bar" :style="`background: linear-gradient(to right, ${statsColorsStr[index]} ${statRelToMax[index]}%, rgba(0, 0, 0, 0) 0%);`">

                </div>
            </div>
        </div>
</template>
<style scoped>
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
</style>