<script lang="ts" setup>
import { useVersionStore } from '@/stores/versions';

    
    const versionStore = useVersionStore()
    const chosen = versionStore.chosenVersion
    //formatting date
    const date = new Date(chosen.date)
    const dateText = `${date.getFullYear()}/${date.toLocaleString('default', { month: 'long' }).slice(0, 3)}/${date.getDate()}`
</script>
<template>
    <footer>
        Using version {{ versionStore.chosenVersionName }} made at {{ dateText }} from commit {{  chosen.commit }}
    </footer>
</template>
<style scoped>
    footer{
        position: absolute;
        bottom: 0;
    }
</style>