<script lang="ts" setup>
import { gamedata } from '@/stores/gamedata';
import type { CompactBattleMon } from '@/stores/gamedata_type';
import { getSpecieImage } from '@/utils/images';
import { cConstToStringName } from '@/utils/poke_utils';
import { computed } from 'vue';

type Props = {
    mon: CompactBattleMon
}
const props = withDefaults(defineProps<Props>(), {})
const specie = computed(()=> gamedata.value.species[props.mon.specie])
</script>
<template>
<div style="display: flex;">
    <div class="left-part">
        <img :src="getSpecieImage(specie.NAME)">
        <div> <span> {{  gamedata.abilities[specie.abilities[mon.abi]]?.name }}</span></div>
    </div>
    <div>
        <div class="innates" v-for="(inn, index) of specie.innates" :key="index"> 
            <span> {{ gamedata.abilities[inn].name }}</span>
        </div>
        <div class="item" v-if="~mon.item">
            <span> {{  cConstToStringName(gamedata.items[mon.item]) }} </span>
        </div>
    </div>
    <div class="moves">
        <div v-for="(moveID, index) of mon.moves" :key="index">
            <span> {{ gamedata.moves[moveID].name }} </span>
        </div>
    </div>
</div>
</template>
<style scoped>
    
</style>