<script lang="ts" setup>
import type { CompactTrainer } from '@/stores/gamedata_type';
import BattleMon from './BattleMon.vue';

type Props = {
    trainer: CompactTrainer
    id: number
}
withDefaults(defineProps<Props>(), {})

</script>
<template>
<div style="display: flex;flex-direction: column;">
    <div>
        <span>  {{  trainer.name }} </span>
    </div>
    <div>
        <div> Regular team </div>
        <BattleMon v-for="(mon, index) of trainer.party" :key="index" :mon="mon"/>
    </div>
    <div v-if="trainer.elite && trainer.elite.length">
        <div> Elite team </div>
        <BattleMon v-for="(mon, index) of trainer.elite" :key="index" :mon="mon"/>
    </div>
</div>
</template>
<style scoped>
    
</style>