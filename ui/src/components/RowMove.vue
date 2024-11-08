<script lang="ts" setup>
import { gamedata } from '@/stores/gamedata';
import type { CompactMove } from '@/stores/gamedata_type';
import { ref } from 'vue';

type Props = {
    move: CompactMove
    height: number,
}
const props = withDefaults(defineProps<Props>(), {})
const moveView = ref(false)
</script>
<template>
    <div class="row" v-if="!moveView" @click="moveView = true">
        <div class="row-block" style="width: 9em;min-width: 9em;">
            <div class="block-text">
                <span> {{ move.name }} </span>
            </div>
        </div>
        <div class="row-block" style="width: 4em;min-width: 4em;">
            <div  class="block-text">
                <span> {{ move.power }}</span>
            </div>
        </div>
        <div class="row-block" style="width: 4em;min-width: 4em;">
            <div  class="block-text">
                <span> {{ move.acc }}</span>
            </div>
        </div>
        <div class="row-block" style="width: 4em;min-width: 4em;">
            <div  class="block-text">
                <span> {{ move.prio }}</span>
            </div>
        </div>
        <div class="row-block" style="width: 7em;min-width: 7em;">
            <div :class="`block-text ${gamedata.types[move.type].toLowerCase()}`">
                <span> {{ gamedata.types[move.type] }}</span>
            </div>
            <div :class="`block-text ${gamedata.types[move.type2].toLowerCase()}`" v-if="gamedata.types[move.type2]">
                <span> {{ gamedata.types[move.type2] }}</span>
            </div>
        </div>
        <div class="row-block" style="width: 7em;min-width: 7em;">
            <div  class="block-text">
                <span> {{ gamedata.moveCategoryT[move.category] }}</span>
            </div>
        </div>
        <div class="row-block" style="width: 4em;min-width: 4em;">
            <div  class="block-text">
                <span> {{ move.chance }}</span>
            </div>
        </div>
        <div class="row-block" style="width: 4em;min-width: 4em;">
            <div  class="block-text">
                <span> {{ move.criticalStage }}</span>
            </div>
        </div>
        <div class="row-block" style="width: 4em;min-width: 4em;">
            <div  class="block-text">
                <span> {{ move.strikeCount }}</span>
            </div>
        </div>
        <div class="row-block" style="width: 4em;min-width: 4em;">
            <div  class="block-text">
                <span> {{ move.pp }}</span>
            </div>
        </div>
        <div class="row-block" style="flex-grow: 1;overflow: scroll;">
            <div  class="block-text">
                <span> {{ move.description }}</span>
            </div>
        </div>
    </div>
    <div class="row" style="flex-direction: column;"  v-else @click="moveView = false">
        <div class="flags-list" v-if="move.flags.length">
            <div class="flag"> <span>Flags: </span></div>
            <div class="flag" v-for="flag of move.flags" :key="flag">
                <span> {{  gamedata.moveFlagsT[flag] }}</span>
            </div>
        </div>
        <div class="flags-list" v-if="move.ban.length">
            <div class="flag"> <span>F.Bans: </span></div>
            <div class="flag" v-for="flag of move.ban" :key="flag">
                <span> {{  gamedata.moveFlagsBanT[flag] }}</span>
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
.flags-list{
    display: flex;
    height: 50%;
    overflow: scroll;
}
.flag{
    padding-left: 0.5em;
}
</style>