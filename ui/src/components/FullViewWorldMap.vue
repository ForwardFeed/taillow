<script lang="ts" setup>
import { gamedata } from '@/stores/gamedata';
import type { CompactWorldMap } from '@/stores/gamedata_type';
import { cConstToStringName } from '@/utils/poke_utils';

type Props = {
    worldMap: CompactWorldMap
    id: number,
}

function convertEncounterField(encField: string): string{
    return {
        "land_mons": "grass",
        "water_mons": "water",
        "rock_smash_mons": "rocksmash",
        "fishing_mons": "fishe",
        "honey_mons": "honey",
        "hidden_mons": "hidden"
    }[encField] || encField
}

withDefaults(defineProps<Props>(), {})
</script>
<template>
<div style="display: flex;flex-direction: column;">
    <div>
        <span> {{  cConstToStringName(worldMap.name) }} </span>
    </div>
    <div>
        <div v-for="(encField, index) of worldMap.encounters" :key="index">
            <div> 
                <span> {{ convertEncounterField(gamedata.encounterFields[index]) }}</span>
            </div>
            <div v-for="(enc, index) of encField?.mons" :key="index">
               <div>
                    <span> {{ gamedata.species[enc.specie].name }} </span>
               </div>
               <div>
                    <span> {{ enc.min_level }} - {{ enc.max_level }}  </span>
               </div>
            </div>
        </div>
    </div>
</div>
</template>
<style scoped>
    
</style>