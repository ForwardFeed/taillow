<script lang="ts" setup>
import type { CompactTrainer } from '@/stores/gamedata_type';

type Props = {
    trainer: CompactTrainer
    height: number
}
const props = withDefaults(defineProps<Props>(), {})
</script>
<template>
    <div class="row">
        <div > {{ trainer.name }} </div>
    </div>
</template>
<style scoped>
.row{
    height: v-bind(height + "px");
    background-color: cadetblue;
}
</style>