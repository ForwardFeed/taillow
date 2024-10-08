<script lang="ts" setup>
import SettingsField from '@/components/SettingsField.vue';
import { useVersionStore } from '@/stores/versions';

    
    const versions = useVersionStore()
    // when changing version
    function updateVersion(ev: Event){
        const target = ev.target as HTMLInputElement 
        versions.changeVersion(target.value)
    }
    
</script>
<template>
    <SettingsField text="Game version" tooltip="change it to change your version">
        <select @change="updateVersion" :selected="versions.chosenName" autocomplete="off">
        <!-- the selected is specfically a behavior of firefox-->
            <option :value="item" v-for="(item, index) in versions.versionsList" :key="index"
             :selected="versions.chosenName == item">
                {{ item }}
            </option>
        </select>
    </SettingsField>
</template>
<style scoped>
    
</style>