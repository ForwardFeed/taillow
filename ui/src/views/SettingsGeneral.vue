<script lang="ts" setup>
import CustomCheckBoxes from '@/components/CustomCheckBoxes.vue';
import SettingsField from '@/components/SettingsField.vue';
import { defaultGeneralSettings } from '@/data/settings/settings_general'
import { defaultDexSettings } from '@/data/settings/settings_dex'
import { changeGlobalCssVariables, defaultThemeSettings } from '@/data/settings/settings_theme'
import { defaultCalcSettings } from '@/data/settings/settings_calc'
import { defaultBuilderSettings } from '@/data/settings/settings_builder'
import { useSettingsStore } from '@/stores/settings';
import { useVersionStore } from '@/stores/versions';
import { ref } from 'vue';
import { copyObjectProps, objectKeys } from '@/utils/utils';


    const settings = useSettingsStore()
    const versions = useVersionStore()
    // when changing version
    function updateVersion(ev: Event){
        const target = ev.target as HTMLInputElement 
        versions.changeVersion(target.value)
    }

    const showResetBtn = ref(false)
  
    const resetList = ["general",  "theme", "dex", "builder", "calc"]

    const storeToReset = ref([] as string[])

    function changeReset(values: string[]){
        storeToReset.value = values
        showResetBtn.value = !!values.length
    }
    
    function applyReset(){
        showResetBtn.value = false
        for(const storeName of storeToReset.value){
            let keys
            switch(storeName){
                case "general":
                    versions.changeVersion(versions.data?.latest || "")
                    copyObjectProps(settings.general, defaultGeneralSettings)
                    break;
                case "theme":
                    copyObjectProps(settings.theme, defaultThemeSettings)
                    changeGlobalCssVariables(settings.theme.current)
                    break;
                case "dex":
                    copyObjectProps(settings.dex, defaultDexSettings)
                    break;
                case "builder":
                    copyObjectProps(settings.builder, defaultBuilderSettings)
                    break;
                case "calc":
                    copyObjectProps(settings.calc, defaultCalcSettings)
                    break;
                default:
                    throw `${storeName} wasn't recognized as a store name`
            }
        }
        storeToReset.value = []
    }

</script>
<template>
    <SettingsField text="Game version" tooltip="Change the data to match the game version used">
        <select @change="updateVersion" :selected="versions.chosenName" autocomplete="off">
            <option :value="item" v-for="(item, index) in versions.versionsList" :key="index"
             :selected="versions.chosenName == item">
                {{ item }}
            </option>
        </select>
    </SettingsField>
    <SettingsField text="reset settings" tooltip="This completely wipe out the locally stored data about settings">
        <CustomCheckBoxes :list="resetList" @change="changeReset" :checked="storeToReset"/>
        <button v-if="showResetBtn" class="red-btn" @click="applyReset">Confirm</button>
    </SettingsField>
</template>
<style scoped>
    .red-btn{
        color: rgb(99, 15, 15);
        background-color: rgb(236, 99, 122);
    }
    .red-btn:hover{
        color: rgb(46, 6, 6);
        background-color: rgb(243, 183, 193);
    }
</style>