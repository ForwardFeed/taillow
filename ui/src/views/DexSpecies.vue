<script lang="ts" setup>
import { useVirtualList } from '@vueuse/core'
import { gamedata } from '@/stores/gamedata';
import { ref } from 'vue';
import SpecieRow from '@/components/SpecieRow.vue';
const lista = ref(gamedata.species.slice(0, 400))
console.log(lista)
const { list, containerProps, wrapperProps } = useVirtualList(
    lista ,
    {
        itemHeight: 64,
    },
)
</script>
<template>

<div class="scroll-container-parent">
    <div style="height: 90px; background-color: aqua;">
        hey
    </div>
    <div v-bind="containerProps" class="scroll-container">
        <div v-bind="wrapperProps">
            <template v-for="item in list" :key="item.index">
                <SpecieRow :specie="item.data" style="height: 64px"></SpecieRow>
            </template>
        </div>
    </div>
</div>


</template>
<style scoped>
.scroll-container-parent{
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}
.scroll-bar{
    width: 1em;
    background-color: red;
}
</style>