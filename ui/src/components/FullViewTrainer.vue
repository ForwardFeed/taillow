<script lang="ts" setup>
import type { CompactTrainer } from '@/stores/gamedata_type';
import BattleMon from './BattleMon.vue';

type Props = {
    trainer: CompactTrainer
    id: number
}
const props = withDefaults(defineProps<Props>(), {})
</script>
<template>
<div style="display: flex;flex-direction: column;">
    <div>
        <span>  {{  trainer.name }} </span>
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
</style>