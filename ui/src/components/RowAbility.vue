<script lang="ts" setup>
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
    <div class="row">
        <div class="minimun-view">
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
            TODO! put species associated here, or additionnal informations
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
</style>