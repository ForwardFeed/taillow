<script lang="ts" setup>
import type { CompactWorldMap } from '@/stores/gamedata_type';

type Props = {
    worldMap: CompactWorldMap
    id: number,
}

withDefaults(defineProps<Props>(), {})
</script>
<template>
    <div>
        {{  worldMap.name }}
    </div>
</template>
<style scoped>
    
</style>