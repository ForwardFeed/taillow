<script lang="ts" setup>
import type { DeepReadonly } from 'vue';
import { gamedata } from '@/stores/gamedata';
import type { CompactSpecie } from '@/stores/gamedata_type';
type Props = {
    specie:  DeepReadonly<CompactSpecie>
}
const props = withDefaults(defineProps<Props>(), {
    
})

</script>
<template>
    <div class="row">
        <img :src="`/img/${props.specie.NAME}.png`">
        <div> {{ props.specie.name }}</div>
        <div> {{ props.specie.types.map(x => gamedata.types[x]) }}</div>
    </div>
</template>
<style scoped>
    .row{
        width: 100%;
        display: flex;
    }
</style>