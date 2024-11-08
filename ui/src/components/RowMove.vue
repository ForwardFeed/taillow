<script lang="ts" setup>
import { gamedata } from '@/stores/gamedata';
import type { CompactMove } from '@/stores/gamedata_type';

type Props = {
    move: CompactMove
    height: number,
}
const props = withDefaults(defineProps<Props>(), {})
</script>
<template>
    <div class="row">
        <div class="row-block" style="width: 9em;">
            <div class="block-text">
                <span> {{ move.name }} </span>
            </div>
        </div>
        <div class="row-block" style="width: 4em;">
            <div  class="block-text">
                <span> {{ move.power }}</span>
            </div>
        </div>
        <div class="row-block" style="width: 4em;">
            <div  class="block-text">
                <span> {{ move.acc }}</span>
            </div>
        </div>
        <div class="row-block" style="width: 4em;">
            <div  class="block-text">
                <span> {{ move.prio }}</span>
            </div>
        </div>
        <div class="row-block" style="width: 7em;">
            <div :class="`block-text ${gamedata.types[move.type].toLowerCase()}`">
                <span> {{ gamedata.types[move.type] }}</span>
            </div>
            <div :class="`block-text ${gamedata.types[move.type2].toLowerCase()}`" v-if="gamedata.types[move.type2]">
                <span> {{ gamedata.types[move.type2] }}</span>
            </div>
        </div>
        <div class="row-block" style="width: 7em;">
            <div  class="block-text">
                <span> {{ gamedata.moveCategoryT[move.category] }}</span>
            </div>
        </div>
    </div>
</template>
<style scoped>
.row{
    height: v-bind(height + "px");
    background-color: cadetblue;
    display: flex;
}
.row-block{
    display: flex;
    flex-direction: column;
}
.block-text{
    height: 100%;
    text-align: center;
    display: flex;
}
</style>