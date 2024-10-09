<script lang="ts" setup>
import FloatingWindow from '@/components/FloatingWindow.vue';
import SettingsField from '@/components/SettingsField.vue';
import { defaultThemePresets, presetList, type PresetList } from '@/data/settings/settings_theme';
import { useSettingsStore } from '@/stores/settings';
import { ref } from 'vue';
import { ColorPicker } from 'vue-color-kit'
import 'vue-color-kit/dist/vue-color-kit.css'

const megaStore = useSettingsStore()
const store = megaStore.theme

const showSaveCustom = ref(false)

function changePreset(payload: Event){
    const target = payload.target as HTMLInputElement
    const val = target.value
    if (val == "custom"){
        store.current = store.custom
    } else {
        store.current = defaultThemePresets[val as PresetList]
    }
}

function saveCurrentAsCustom(){
    showSaveCustom.value = false
    store.custom = store.current
}

function colorChange(x: any){
    console.log(x)
}

</script>
<template>
    <SettingsField text="Preset" tooltip="warning this will erase all your changes">
        <select @change="changePreset" :selected="store.preset" autocomplete="off">
            <option v-for="preset of presetList" :key="preset"  :selected="store.preset== preset">
                {{ preset }}
            </option>
            <option>
                custom
            </option>
        </select>
        <button v-if="showSaveCustom" @click="saveCurrentAsCustom">Save current as custom</button>
    </SettingsField>
    <SettingsField  text="Color1" tooltip="">
        <div class="color-field" :style="`backgroundColor: ${store.current.color1};`"></div>
        <button @click="">change</button>
    </SettingsField>
    <FloatingWindow :onMouseCursor="true" v-show="false">
        <div class="wrapper-for-grabe-me">
            <div class="grab-me">
                grab-me
            </div>
            <ColorPicker @changeColor="colorChange"/>
        </div>
    </FloatingWindow>
    
</template>
<style scoped>
    .wrapper-for-grabe-me{
        display: flex;
        flex-direction: column;
    }
    .grab-me{
        background-color: wheat;
        width: 100%;
        height: 1em;
        text-align: center;
    }
    .color-field{
        width: 3em;
        height: 100%;
    }
</style>