<script lang="ts" setup>
    import { useVersionStore } from '@/stores/versions';
    import { computed } from 'vue';

    const versions = useVersionStore()
    //formatting date
    const date = computed(()=>{ 
        const date = new Date(versions.chosen?.date || 0)
        return `${date.getFullYear()}/${date.toLocaleString('default', { month: 'long' }).slice(0, 3)}/${date.getDate()}`
    })
    // when changing version
    function updateVersion(ev: Event){
        const target = ev.target as HTMLInputElement 
        versions.changeVersion(target.value)
    }
</script>
<template>
    <footer>
        <span>Using version {{ versions.chosenName }} made at {{ date }} from commit {{ versions.chosen?.commit }}</span>
        <select @change="updateVersion" :selected="versions.chosenName" autocomplete="off">
        <!-- the selected is specfically a behavior of firefox-->
            <option :value="item" v-for="(item, index) in versions.versionsList" :key="index"
             :selected="versions.chosenName == item">
                {{ item }}
            </option>
        </select>
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