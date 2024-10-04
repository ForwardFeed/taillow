<script lang="ts" setup>
import { useCounterStore } from '@/stores/counter';

    const counter = useCounterStore()
</script>
<template>
    <div>
        welcome to the calc
    </div>
    <div>
        counter: {{ counter.count }}
    </div>
</template>
<style scoped>
    
</style>