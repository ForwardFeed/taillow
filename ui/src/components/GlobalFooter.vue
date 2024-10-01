<script lang="ts" setup>
    import { useVersionStore } from '@/stores/versions';
    import { computed } from 'vue';
import CustomSelect from './CustomSelect.vue';

    const versions = useVersionStore()
    //formatting date
    const date = computed(()=>{ 
        const date = new Date(versions.getDate())
        return `${date.getFullYear()}/${date.toLocaleString('default', { month: 'long' }).slice(0, 3)}/${date.getDate()}`
    })
    // when changing version
    function updateVersion(ev: Event){
        const target = ev.target as HTMLInputElement 
        versions.setVersion(target.value)
    }
</script>
<template>
    <footer>
        <span>Using version {{ versions.chosenVersionName }} made at {{ date }} from commit {{ versions.chosenCommit }}</span>
        <select @change="updateVersion" :selected="versions.versions.latest" autocomplete="off">
        <!-- the selected is specfically a behavior of firefox-->
            <option :value="item" v-for="(item, index) in versions.versionsList" :key="index"
             :selected="versions.versions.latest == item">
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