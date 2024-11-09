<script lang="ts" setup>
import { gamedata } from '@/stores/gamedata';
import type { CompactWorldMap } from '@/stores/gamedata_type';
import { cConstToStringName } from '@/utils/poke_utils';
import { computed } from 'vue';

type Props = {
    worldMap: CompactWorldMap
    height: number
}

const props = withDefaults(defineProps<Props>(), {})

const encountersIcons = computed(()=>{
    return props.worldMap.encounters.filter(x => x).map((x, i) => {
        if (!x)
            return ""
        return `/icons/${fieldToIconName(gamedata.value.encounterFields[i])}.png`
    })
})

function fieldToIconName(enc: string):string{
    return {
        "land_mons": "grass",
        "water_mons": "water",
        "rock_smash_mons": "rocksmash",
        "fishing_mons": "fishe",
        "honey_mons": "honey",
        "hidden_mons": "hidden"
    }[enc] || cConstToStringName(enc)
}

</script>
<template>
    <div class="row bg1">
        <div style="display: flex;width: 11em;"> 
            <span>  {{ cConstToStringName(worldMap.name) }} </span>
        </div>
        <div style="flex-grow: 1;display: flex;">
            <img v-for="(encList, index) of encountersIcons" :key="index" :src="encList" class="pixelated" >
        </div>
        <div class="">

        </div>
    </div>
</template>
<style scoped>
.row{
    height: v-bind(height + "px");
    display: flex;
}
</style>