import { ref, computed } from 'vue'
import { defineStore } from 'pinia'


export type DexSettings = {

}

export type BuilderSettings = {

}

export type CalcSettings = {

}

export type GlobalSettings = {
    theme: string //presets or modifiable
}

export const useSettingsStore = defineStore('settings', () => {
    
})

// format to make settings automatically portable without having to manually add
// 
// ref(s) theme to change dynamically css
// 

class Settings{
    generateHTML(){
        
    }
}

class ThemeSettings extends Settings{
    constructor(){
        super()
    }
}