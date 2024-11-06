<script lang="ts" setup>
import type { CompactWorldMap } from '@/stores/gamedata_type';

type Props = {
    worldMap: CompactWorldMap
    height: number
}
const props = withDefaults(defineProps<Props>(), {})
</script>
<template>
    <div class="row">
        <div > {{ worldMap.name }} </div>
    </div>
</template>
<style scoped>
.row{
    height: v-bind(height + "px");
    background-color: cadetblue;
}
</style>