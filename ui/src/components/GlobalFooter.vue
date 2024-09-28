<script lang="ts" setup>
    import type { DataVersions, DataVersion } from '../../../dataing/types/types'
    const res = await fetch('json/versions.json')
    const versions: DataVersions  = await res.json()
    const lastest = versions.latest
    const chosen: DataVersion = versions.list[lastest]
</script>
<template>
    <footer>
        Using version {{ lastest}} made at {{ new Date(chosen.date)}} from commit {{  chosen.commit }}
    </footer>
</template>
<style scoped>
    footer{
        position: absolute;
        bottom: 0;
    }
</style>