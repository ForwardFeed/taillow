<script lang="ts" setup>
import { gamedata } from '@/stores/gamedata';
import type { CompactWorldMap } from '@/stores/gamedata_type';
import { encounterFieldToIconName } from '@/utils/images';
import { cConstToStringName } from '@/utils/poke_utils';
import { computed } from 'vue';

type Props = {
    worldMap: CompactWorldMap
    height: number
}

const props = withDefaults(defineProps<Props>(), {})

const encountersIcons = computed(()=>{
    return props.worldMap.encounters.map((x, i) => {
        if (!x)
            return ""
        return encounterFieldToIconName(gamedata.value.encounterFields[i])
    })
})

const emits = defineEmits<{
    (e: "open-view"): void
}>()

</script>
<template>
    <div class="row bg1">
        <div style="display: flex;width: 11em;"> 
            <span>  {{ cConstToStringName(worldMap.name) }} </span>
        </div>
        <div style="flex-grow: 1;display: flex;">
            <img v-for="(encList, index) of encountersIcons" :key="index" :src="encList" class="pixelated" >
        </div>
        <div style="width: 3em;display: flex;">
            <button @click="emits('open-view')" style="width: 100%;text-align: center;">
                view
            </button>
        </div>
    </div>
</template>
<style scoped>
.row{
    height: v-bind(height + "px");
    display: flex;
}
</style>