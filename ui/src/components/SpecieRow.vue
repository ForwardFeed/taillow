<script lang="ts" setup>
import type { DeepReadonly } from '@/utils/types';
import type { CompactSpecie } from '../../../dataing/src/packer/species';
import { gamedata } from '@/stores/gamedata';
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