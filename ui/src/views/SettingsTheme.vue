<script lang="ts" setup>
import FloatingWindow from '@/components/FloatingWindow.vue';
import FloatingWindowTitle from '@/components/FloatingWindowTitle.vue';
import SettingsField from '@/components/SettingsField.vue';
import { useMouseCoords } from '@/composable/mouse';
import { defaultThemePresets, enumThemeData, presetList, type PresetList, type ThemeData } from '@/data/settings/settings_theme';
import { useErrorStore } from '@/stores/errors';
import { useSettingsStore } from '@/stores/settings';
import { copyToClipboard } from '@/utils/utils';
import { nextTick, ref, watch, type Ref } from 'vue';
import { ColorPicker } from 'vue-color-kit'
import 'vue-color-kit/dist/vue-color-kit.css'

const megaStore = useSettingsStore()
const store = megaStore.theme

const showSaveCustom = ref(false)
const textAreadExportImport = ref() as Ref<undefined | HTMLTextAreaElement>
 
/** this useMouseCoords is a bit weird but I'll explain
 * This is because of the floating window for the color picker doesn't get tracked and start at 0
 * because the mouse coord aren't init and the first click gets spawned out in space
 */
useMouseCoords()

function copyColors(origin: ThemeData, target: ThemeData){
    const keys = Object.keys(enumThemeData) as Array<keyof typeof enumThemeData>
    for (const key of keys){
        target[key] = origin[key]
    }
}

function changePreset(payload: Event){
    const target = payload.target as HTMLInputElement
    const val = target.value
    store.preset = val as PresetList
    if (val == "custom"){
        copyColors(store.custom, store.current)
    } else {
        copyColors( defaultThemePresets[store.preset], store.current)
    }
}
const showSaveIndicator = ref(false)
function saveCurrentAsCustom(){
    showSaveCustom.value = false
    store.custom = store.current
}

watch(store.current, ()=>{showSaveIndicator.value = true})
const showColoricker= ref(false)
let activeColorFieldName: keyof ThemeData | undefined
let activeColor = ref("rgba(0,0,0,1)")
function colorChange(colorObject: any){
    if (!activeColorFieldName)
        return // huh?
    const rgba = colorObject.rgba
    store.current[activeColorFieldName] = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`
}


function editColor(index: keyof ThemeData){
    // remove the window of colorpicker because for some reason activeColor isn't reactive enough?
    showColoricker.value = false 
    activeColor.value = store.current[index]
    activeColorFieldName = index
    nextTick(()=>{
        showColoricker.value = true
    })
}

function saveToCustom(){
    copyColors(store.current, store.custom)
    store.preset = "custom"
    showSaveIndicator.value = false
}

function exportCustom(){
    const textarea = textAreadExportImport.value
    if(!textarea)
        return
    textarea.value = JSON.stringify(store.custom)
    copyToClipboard(textarea.value)
}

function importCustom(){
    const textarea = textAreadExportImport.value
    if(!textarea)
        return
    try{
        const json = JSON.parse(textarea.value)
        store.custom = json
    } catch(e){
        useErrorStore().add("Failed to load Theme Data: invalid JSON")
    }
}

</script>
<template>
    <SettingsField text="Preset" tooltip="warning this will erase all your changes not set to custom">
        <select @change="changePreset" :selected="store.preset" autocomplete="off">
            <option v-for="preset of presetList" :key="preset"  :selected="store.preset== preset">
                {{ preset }}
            </option>
        </select>
        <button v-if="showSaveCustom" @click="saveCurrentAsCustom">Save current as custom</button>
    </SettingsField>
    <SettingsField text="Save all changes to preset Custom?" tooltip="If you change preset you keep your changes this way">
        <button @click="saveToCustom">
            Save To custom
        </button>
        <span class="red" v-if="showSaveIndicator">*</span>
    </SettingsField>
    <SettingsField v-for="(data, index) in enumThemeData" :key="index" :text="data.name" :tooltip="data.tooltip">
        <div class="color-field" :style="`background-color: ${store.current[index]};`" >
            
        </div>
        <button class="sidemargin" @click="editColor(index)">
            Edit
        </button>
        <input class="sidemargin" type="text" v-model="store.current[index]">
    </SettingsField>
    <SettingsField text="Custom: Import/Export">
        <textarea autocomplete="off" ref="textAreadExportImport">

        </textarea>
        <button class="sidemargin" @click="importCustom">
            Import
        </button>
        <button class="sidemargin" @click="exportCustom">
            Export
        </button>
    </SettingsField>
    <FloatingWindow :onMouseCursor="true" v-if="showColoricker">
        <FloatingWindowTitle @closed="showColoricker = false" text="grab-me" />
        <ColorPicker :color="activeColor" @changeColor="colorChange"/>
    </FloatingWindow>
    
</template>
<style scoped>
    .color-field{
        width: 3em;
    }
    .sidemargin{
        margin-left: 0.4em;
    }
</style>