<script lang="ts" setup>
    import type { DataVersions, DataVersion } from '../../../dataing/types/types'
    const res = await fetch('json/versions.json')
    const versions: DataVersions  = await res.json()
    const lastest = versions.latest
    const chosen: DataVersion = versions.list[lastest]

    //formatting date
    const date = new Date(chosen.date)
    const dateText = `${date.getFullYear()}/${date.toLocaleString('default', { month: 'long' }).slice(0, 3)}/${date.getDate()}`
</script>
<template>
    <footer>
        Using version {{ lastest}} made at {{ dateText }} from commit {{  chosen.commit }}
    </footer>
</template>
<style scoped>
    footer{
        position: absolute;
        bottom: 0;
    }
</style>