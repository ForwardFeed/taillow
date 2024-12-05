<script lang="ts" setup>
import { gamedata } from '@/stores/gamedata';
import type { CompactBattleMon } from '@/stores/gamedata_type';
import { getSpecieSprite } from '@/utils/images';
import { cConstToStringName } from '@/utils/poke_utils';
import { computed } from 'vue';
import ToolTip from './ToolTip.vue';
type Props = {
    mon: CompactBattleMon
}
const props = withDefaults(defineProps<Props>(), {})
const specie = computed(()=> gamedata.value.species[props.mon.specie])
const typesStr = specie.value.types.map(x => gamedata.value.types[x].toLowerCase())
const type1 = typesStr[0]
const type2 = typesStr[1]
const styleGradientTextTypes =   `background: var(--${type1});
background: linear-gradient(90deg, var(--${type1}) 43%, var(--${type2}) 57%);`

const styleGradientTextMovesTypes =   props.mon.moves.map(x => gamedata.value.moves[x]).map(x => {
    const moveType = gamedata.value.types[x.type].toLowerCase()
    const moveCat = gamedata.value.moveCategoryT[x.category].toLowerCase()
    /*return `background: var(--${moveType});
background: linear-gradient(90deg, var(--${moveCat}) 3%, var(--${moveType}) 25%);`*/
    return `background: var(--${moveType});`
})
</script>
<template>
<div class="battle-mon">
    <div class="left-part" :style="styleGradientTextTypes">
        <img :src="getSpecieSprite(specie.NAME)" class="sprite pixelated">
        <div style="display: flex;width: 100%;"> 
            <span> {{ gamedata.abilities[specie.abilities[mon.abi]].name }}</span>
            <ToolTip :tip="gamedata.abilities[specie.abilities[mon.abi]].desc"/>
        </div>
    </div>
    <div class="middle-part">
        <div class="innates" v-for="(inn, index) of specie.innates" :key="index"> 
            <span> {{ gamedata.abilities[inn].name }}</span>
            <ToolTip :tip="gamedata.abilities[inn].desc"/>
        </div>
        <div class="item" v-if="~mon.item">
            <span> {{  cConstToStringName(gamedata.items[mon.item]) }} </span>
        </div>
    </div>
    <div class="moves">
        <div v-for="(moveID, index) of mon.moves" :key="index" class="move" :style="styleGradientTextMovesTypes[index]">
            <span> {{ gamedata.moves[moveID].name }} </span>
        </div>
    </div>
</div>
</template>
<style scoped>
.battle-mon{
    display: flex;
    background-color: var(--bg3A);
    border: solid 0.2vmax var(--font-color);
}
.left-part{
    width: 9em;
}
.moves, .middle-part, .left-part{
    display: flex;
    flex-flow: column wrap;
}
.move, .innates, .item{
    display: flex;
    padding-left: 0.4em;
    padding-right: 0.4em;
    width: 9em;
    margin: auto;
    flex-grow: 1;
}
.sprite{
    width: 96px;
    height: 96px;
    margin: auto;
}
</style>