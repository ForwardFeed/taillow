<script lang="ts" setup>
import CustomCheckBoxes from '@/components/CustomCheckBoxes.vue';
import SettingsField from '@/components/SettingsField.vue';
import GlobalFooter from '@/components/GlobalFooter.vue';
import { defaultGeneralSettings } from '@/data/settings/settings_general'
import { defaultDexSettings } from '@/data/settings/settings_dex'
import { defaultThemeSettings } from '@/data/settings/settings_theme'
import { defaultCalcSettings } from '@/data/settings/settings_calc'
import { defaultBuilderSettings } from '@/data/settings/settings_builder'
import { useSettingsStore } from '@/stores/settings';
import { useVersionStore } from '@/stores/versions';
import { ref } from 'vue';
import { copyObjectProps } from '@/utils/utils';
import { changeGamedataVersion } from '@/stores/gamedata';
import type { VersionsAvailable } from '../../../config';


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
        switch(storeName){
            case "general":
                versions.changeVersion(versions.data?.latest || "")
                copyObjectProps(settings.general, defaultGeneralSettings)
                break;
            case "theme":
                copyObjectProps(settings.theme, defaultThemeSettings)
                settings.theme.preset = "a"
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
function forceRefresh(){
    changeGamedataVersion(versions.chosenVersionName as VersionsAvailable, true)
}
</script>
<template>
    <SettingsField text="Game version" tooltip="Change the data to match the game version used">
        <select @change="updateVersion" :selected="versions.chosenVersionName" autocomplete="off">
            <option :value="item" v-for="(item, index) in versions.versionsList" :key="index"
             :selected="versions.chosenVersionName == item">
                {{ item }}
            </option>
        </select>
        <button @click="forceRefresh">
            Force Refresh data
        </button>
    </SettingsField>
    <SettingsField text="reset settings" tooltip="This completely wipe out the locally stored data about settings">
        <CustomCheckBoxes :list="resetList" @change="changeReset" :checked="storeToReset"/>
        <button v-if="showResetBtn" class="red-btn" @click="applyReset">Confirm</button>
    </SettingsField>
    <GlobalFooter/>
</template>
<style scoped>
    
</style>