<script lang="ts" setup>
import { gamedata } from '@/stores/gamedata';
import type { CompactTrainer } from '@/stores/gamedata_type';
import { ref } from 'vue';

type Props = {
    trainer: CompactTrainer
    height: number
}
const props = withDefaults(defineProps<Props>(), {})
const currRematch = ref(0)
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
            <img :src="`/img/${gamedata.species[specieID.specie]?.NAME}.png`" 
            v-for="(specieID, index) of trainer.party" :key="index" 
            :width="props.height" :height="props.height">
        </div>
        <div v-if="trainer.elite && trainer.elite.length" :style="`display: flex; width: ${props.height * 6}px;`">
            <img :src="`/img/${gamedata.species[specieID.specie]?.NAME}.png`" 
            v-for="(specieID, index) of trainer.elite" :key="index" 
            :width="props.height" :height="props.height">
        </div>
    </div>
</template>
<style scoped>
.row{
    height: v-bind(height + "px");
    display: flex;
}
</style>