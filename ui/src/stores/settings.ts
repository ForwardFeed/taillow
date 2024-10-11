import { reactive, watch, type Reactive } from 'vue'
import { defineStore } from 'pinia'
import { wrapperLocalStorage, type AllowedListOfStorableFields } from '@/utils/localstorage'
import { defaultGeneralSettings } from '@/data/settings/settings_general'
import { defaultDexSettings } from '@/data/settings/settings_dex'
import { defaultThemeSettings } from '@/data/settings/settings_theme'
import { defaultCalcSettings } from '@/data/settings/settings_calc'
import { defaultBuilderSettings } from '@/data/settings/settings_builder'
import type { SettingsStore } from '@/data/settings/types'


function setupSettingWrapper<T extends object>(name: AllowedListOfStorableFields, defaultObject: T, reset: boolean=false): Reactive<T>{
    const obj = {} as T
    const keys = Object.keys(defaultObject) as Array<keyof T>
    const savedData = wrapperLocalStorage.getItem(name)
    console.log('saved data of key ' + name , savedData)
    if (savedData && !reset){
        const savedDataObj = JSON.parse(savedData)
        for (const key of keys){
            // in case new fields are added in an update
            obj[key] = defaultObject[key]
            obj[key] = savedDataObj[key]
        }
    } else {
        for (const key of keys){
            obj[key] = defaultObject[key]
        }
    }
   
    const toReturn = reactive(obj)
   
    watch(toReturn, ()=>{
        console.log("HEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEy" + name)
        wrapperLocalStorage.setItem(name, toReturn)
    })
    return toReturn
}

export const useSettingsStore = defineStore('settings', () => {
    
    const general = setupSettingWrapper("settingsGeneral", defaultGeneralSettings)
    const dex     = setupSettingWrapper("settingsDex", defaultDexSettings)
    const theme   = setupSettingWrapper("settingsTheme", defaultThemeSettings)
    const builder = setupSettingWrapper("settingsBuilder", defaultBuilderSettings)
    const calc    = setupSettingWrapper("settingsCalc", defaultCalcSettings)
    
    const fullStore: SettingsStore =  {
        general,
        theme,
        dex,
        builder,
        calc,
    }

    return fullStore
})

export function resetTheme(){

}
