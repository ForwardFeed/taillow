<script lang="ts" setup>
import { gamedata } from '@/stores/gamedata';
import type { CompactTrainer } from '@/stores/gamedata_type';
import { getSpecieImage } from '@/utils/images';
import { ref } from 'vue';

type Props = {
    trainer: CompactTrainer
    height: number
}
const props = withDefaults(defineProps<Props>(), {})
const currRematch = ref(0)

const emits = defineEmits<{
    (e: "open-view"): void
}>()

function nextRematch(){
    if (!props.trainer.rematch)
        return
    if (currRematch.value === props.trainer.rematch.length){
        currRematch.value = 0
        return 
    }
    currRematch.value++
}
</script>
<template>
    <div class="row bg1">
        <div style="width: 15em;display: flex"> 
             <span>{{ trainer.name }}  {{  gamedata.trainerClasses[trainer.trainerClass] }} </span> 
        </div>
        <div v-if="trainer.rematch && trainer.rematch.length">
            <button @click="nextRematch"> 
                {{ currRematch ? `Rematch N°${currRematch}` : "Base Team" }}
            </button>
        </div>
        <div :style="`display: flex; width: ${props.height * 6}px;`">
            <img :src="getSpecieImage(gamedata.species[specieID.specie]?.NAME)" 
            v-for="(specieID, index) of trainer.party" :key="index" 
            :width="props.height" :height="props.height">
        </div>
        <div v-if="trainer.elite && trainer.elite.length" :style="`display: flex; width: ${props.height * 6}px;`">
            <img :src="getSpecieImage(gamedata.species[specieID.specie]?.NAME)" 
            v-for="(specieID, index) of trainer.elite" :key="index" 
            :width="props.height" :height="props.height">
        </div>
        <div style="flex-grow: 1;">

        </div>
        <div style="width: 3em;display: flex;">
            <button @click="emits('open-view')" style="width: 100%;text-align: center;">
                view
            </button>
        </div>
    </div>
</template>
<style scoped>
.row{
    height: v-bind(height + "px");
    display: flex;
}
</style>