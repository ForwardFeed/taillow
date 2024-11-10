<script lang="ts" setup>
import type { CompactTrainer } from '@/stores/gamedata_type';

type Props = {
    trainer: CompactTrainer
    id: number
}
withDefaults(defineProps<Props>(), {})

</script>
<template>
    {{  trainer.name }}
</template>
<style scoped>
    
</style>