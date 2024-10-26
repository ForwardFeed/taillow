<script lang="ts" setup>
import { useVirtualList } from '@vueuse/core'
import { gamedata } from '@/stores/gamedata';
import { ref } from 'vue';
const lista = ref(gamedata.species.slice(0, 40))
console.log(lista)
const { list, containerProps, wrapperProps } = useVirtualList(
    lista ,
    {
        itemHeight: 30,
    },
)
</script>
<template>
<div class="scroll-container">
    <div class="scroll-content">
        <div v-bind="containerProps" style="height: 100vh">
            <div v-bind="wrapperProps">
                <div v-for="item in list" :key="item.index" style="height: 44px">
                    Row: {{ item.data.NAME }}
                </div>
            </div>
        </div>
    </div>
    <div class="scroll-bar">

    </div>
</div>

</template>
<style scoped>
.scroll-container{
    display: flex;
}
.scroll-content{
    flex-grow: 1;
}
.scroll-bar{
    width: 1em;
    background-color: red;
}
</style>