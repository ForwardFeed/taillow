<script lang="ts" setup>
import type { CompactMove } from '@/stores/gamedata_type';

type Props = {
    move: CompactMove
    height: number,
}
const props = withDefaults(defineProps<Props>(), {})
</script>
<template>
    <div class="row">
        <div > {{ move.name }} </div>
    </div>
</template>
<style scoped>
.row{
    height: v-bind(height + "px");
    background-color: cadetblue;
}
</style>