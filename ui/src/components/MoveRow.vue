<script lang="ts" setup>
import { gamedata } from '@/stores/gamedata';
import type { CompactMove } from '@/stores/gamedata_type';

type Props = {
    move: CompactMove
}
const props = withDefaults(defineProps<Props>(), {})
const type1 = gamedata.value.types[props.move.type].toLowerCase()
const type2 = gamedata.value.types[props.move.type].toLowerCase()
const backgroundColor = props.move.type2 ? 
`background: var(--${type1});` :
``
</script>
<template>
<div>
    <span> {{ move.power }}</span>
    <span> {{ move.name }}</span>
</div>
</template>
<style scoped>
.move{
    display: flex;
}
</style>