import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { AllCompactGamedata } from '../../../dataing/src/export_types'
import type { VersionsAvailable } from '../../../dataing/config'
import { useFetchGzip, useFetchJson } from '@/composable/fetch'

export const useGamedataStore = defineStore('gamedata', () => {
    const gamedata: Ref<AllCompactGamedata> = ref({
        species: [],
        abilities: []
    })
    function changeVersion(available: VersionsAvailable) {
        /*useFetchJson(`/json/gamedataV${available}.json`, (fetchedData: AllCompactGamedata)=>{
            console.log(fetchedData)
            gamedata.value = fetchedData
        })*/
        useFetchGzip(`/gzip/gamedataV${available}.gzip`)
    }

    return { 
        gamedata,
        changeVersion
    }
})
