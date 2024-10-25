<script setup lang="ts">
import { useGamedataStore } from '@/stores/gamedata';
import { ref, watch } from 'vue';
    const refxd = ref(0)
    const gamedata = useGamedataStore()
    watch(()=>gamedata.gamedataCount, ()=>{
        refxd.value++
    })
</script>
  
<template>
    <div>
        Welcome to the dex {{ refxd }}
    </div>
   
    <div v-for="(specie, index) of gamedata.gamedata.species" :key="index">
        {{ specie.name }}
    </div>
</template>
<style scoped>
    
</style>