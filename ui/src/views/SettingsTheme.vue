<script lang="ts" setup>
import FloatingWindow from '@/components/FloatingWindow.vue';
import SettingsField from '@/components/SettingsField.vue';
import { presetList } from '@/data/settings/settings_theme';
import { useSettingsStore } from '@/stores/settings';
import { ColorPicker } from 'vue-color-kit'
import 'vue-color-kit/dist/vue-color-kit.css'


function colorChange(x: any){
    console.log(x)
}
const megaStore = useSettingsStore()
const store = megaStore.theme

</script>
<template>
    <SettingsField text="preset" tooltip="warning this will erase all your changes">
        <select name="" id="">
            <option v-for="preset in presetList" :key="preset">
                {{ preset }}
            </option>
        </select>
    </SettingsField>
    <SettingsField  text="color1" tooltip="">
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