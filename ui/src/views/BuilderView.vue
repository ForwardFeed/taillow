<script lang="ts" setup>
import { ref } from 'vue';

    const count = ref(0)
    function update(){
        count.value++
    }
</script>
<template>
    <div>
        Welcome to the builder {{ count }}
    </div>
    <button @click="update" >
        upgrade
    </button>
</template>
<style scoped>
    
</style>