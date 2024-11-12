<script lang="ts" setup>
    import { useVersionStore } from '@/stores/versions';
    import { computed } from 'vue';

    const versions = useVersionStore()
    //formatting date
    const date = computed(()=>{ 
        const date = new Date(versions.chosenVersionData?.date || 0)
        return `${date.getFullYear()}/${date.toLocaleString('default', { month: 'long' }).slice(0, 3)}/${date.getDate()}`
    })
</script>
<template>
    <footer>
        <span>
            Using version {{ versions.chosenVersionName }} data generated the
            {{ date }} from commit {{ versions.chosenVersionData?.commit }}
        </span>
    </footer>
</template>
<style scoped>
    footer{
        position: absolute;
        bottom: 0;
        display: flex;
        width: 100%;
        font-size: 0.5em;
    }
    footer > *{
        margin: auto;
    }
</style>