<script lang="ts" setup>
import type { CompactTrainer } from '@/stores/gamedata_type';
import BattleMon from './BattleMon.vue';
import { gamedata } from '@/stores/gamedata';

type Props = {
    trainer: CompactTrainer
    id: number
}
const props = withDefaults(defineProps<Props>(), {})
    const emits = defineEmits<{
        (e: "next-trainer"): void,
        (e: "prev-trainer"): void,
        (e: "close-view"): void,
}>()

function prevTrainer(){
    emits("prev-trainer")
}
function nextTrainer(){
    emits("next-trainer")
}
function closeView(){
    emits("close-view")
}
</script>
<template>
<div style="display: flex;flex-direction: column;">
    <div class="controls-row">
        <button class="control" @click="prevTrainer()">
            ↑ prev trainer
        </button>
        <button class="control" @click="nextTrainer()">
            ↓ next trainer
        </button>
        <button class="control" @click="closeView()">
            ← Return to list
        </button>
    </div>
    <div>
        <span>{{ props.trainer.name }}  {{  gamedata.trainerClasses[props.trainer.trainerClass] }} </span> 
    </div>
    <div class="trainer-category"> <span> Regular team </span> </div>
    <div class="trainer-team">
        <BattleMon v-for="(mon, index) of trainer.party" :key="index" :mon="mon"/>
    </div>
    <div class="trainer-category"> <span>Elite team </span></div>
    <div class="trainer-team" v-if="trainer.elite && trainer.elite.length">
        
        <BattleMon v-for="(mon, index) of trainer.elite" :key="index" :mon="mon"/>
    </div>
</div>
</template>
<style scoped>
.trainer-category{
    font-size: 1.1em;
}
.trainer-team{
    display: flex;
    flex-wrap: wrap;
}
.controls-row{
    display: flex;
}
.control{
    margin: auto;
}
</style>