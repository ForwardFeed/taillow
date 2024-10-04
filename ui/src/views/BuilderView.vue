<script lang="ts" setup>
import { useCounterStore } from '@/stores/counter';
import { ref } from 'vue';

    function update(){
        counter.increment()
    }
    const counter = useCounterStore()
</script>
<template>
    <div>
        Welcome to the builder {{ counter.count }}
    </div>
    <button @click="update" >
        upgrade
    </button>
</template>
<style scoped>
    div{
        background-color: var(--bg1);
        color: var(--c1);
    }
</style>