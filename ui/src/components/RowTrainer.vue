<script lang="ts" setup>
import { gamedata } from '@/stores/gamedata';
import type { CompactTrainer } from '@/stores/gamedata_type';

type Props = {
    trainer: CompactTrainer
    height: number
}
withDefaults(defineProps<Props>(), {})
</script>
<template>
    <div class="row bg1">
        <div>  <span>{{ trainer.name }} </span> </div>
        <div>
            <span> {{  gamedata.trainerClasses[trainer.trainerClass] }}</span>
        </div>
    </div>
</template>
<style scoped>
.row{
    height: v-bind(height + "px");
}
</style>