import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { AllCompactGamedata } from '../../../dataing/types/export_types'
export const useGamedataStore = defineStore('gamedata', () => {
    const gamedata: AllCompactGamedata = reactive({
        species: [],
        abilities: []
    })
    function changeVersion() {
        
    }

    return { 
        gamedata
    }
})
