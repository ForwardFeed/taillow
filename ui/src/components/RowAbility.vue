<script lang="ts" setup>
import { gamedata } from '@/stores/gamedata';
import type { CompactAbility } from '@/stores/gamedata_type';
import { ref } from 'vue';
type Props = {
    abi: CompactAbility,
    height: number,
}
const props = withDefaults(defineProps<Props>(), {})
const viewState = ref(false)

</script>
<template>
    <div class="row" @click="viewState = !viewState" >
        <div class="minimun-view" v-if="!viewState">
            <div class="abi-field" style="width: 9em;">
                <span> {{ props.abi.name  }}</span>
            </div>
            <div class="abi-field" style="flex-grow: 1;">
                <span> {{ props.abi.desc }}</span>
            </div>
            <div class="abi-field" style="width: 9em;">
                <span> ID: {{ props.abi.internalID }} </span>
            </div>
        </div>
        <div class="maximun" v-if="viewState">
            <div style="display: flex;">
                <span> Species with this ability</span>
            </div>
            <img v-for="specie of abi.b_species" :key="specie" 
            :src="`/img/${gamedata.species[specie].NAME}.png`" :height="height" :width="height">
        </div>
    </div>
    
</template>
<style scoped>
.row{
    height: v-bind(height + "px");
    background-color: cadetblue;
}
.minimun-view, .row{
    width: 100%;
    display: flex;
}
.abi-field{
    margin: auto;
    display: flex;
}
.maximun{
    display: flex;
    flex-wrap: wrap;
    z-index: 0;
}
</style>