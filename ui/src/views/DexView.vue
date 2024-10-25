<script setup lang="ts">
import { gamedata, useGamedataStore } from '@/stores/gamedata';
import { ref, watch } from 'vue';
    const refxd = ref(0)
    const gamedataStore = useGamedataStore()
    watch(()=>gamedataStore.gamedataCount, ()=>{
        refxd.value++
    })
</script>
  
<template>
    <div>
        Welcome to the dex {{ refxd }}
    </div>
   
    <div v-for="(specie, index) of gamedata.species" :key="index">
        {{ specie.name }}
    </div>
</template>
<style scoped>
    
</style>