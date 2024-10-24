<script setup lang="ts">
import { useGamedataStore } from '@/stores/gamedata';
import { ref, watch } from 'vue';
    const refxd = ref(0)
    const data = useGamedataStore()
    watch(()=>data.gamedataCount, ()=>{
        refxd.value++
    })
</script>
  
<template>
    <div>
        Welcome to the dex {{ refxd }}
    </div>
</template>
<style scoped>
    
</style>