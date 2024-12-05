<script lang="ts" setup>
import { gamedata } from '@/stores/gamedata';
import type { CompactMove } from '@/stores/gamedata_type';

type Props = {
    move: CompactMove
}
const props = withDefaults(defineProps<Props>(), {})
const type1 = gamedata.value.types[props.move.type].toLowerCase()
const type2 = gamedata.value.types[props.move.type2]?.toLowerCase()
const backgroundColor = type2 ? 
`background: var(--${type1});background: linear-gradient(90deg, var(--${type1}) 43%, var(--${type2}) 57%);` :
`background: var(--${type1});`
const moveCategoryBackgroundColor = `background: var(--${gamedata.value.moveCategoryT[props.move.category].toLowerCase()});`
</script>
<template>
<div  :style="backgroundColor" class="move-row">
    <span  style="width: 3em;"> {{ move.power }}</span>
    <span  style="width: 11em;"> {{ move.name }}</span>
</div>
</template>
<style scoped>
.move-row{
    display: flex;

}
</style>