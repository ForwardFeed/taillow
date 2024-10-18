import { ref,watch,type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { DataVersions, DataVersion } from '../../../dataing/src/exporter/types'
import { useFetchJson } from '@/composable/fetch'
import type { VersionsAvailable } from '../../../dataing/config'
import { useSettingsStore } from './settings'
import { useGamedataStore } from './gamedata'



export const useVersionStore = defineStore('version', () => {

    const settings = useSettingsStore()
    const gamedata = useGamedataStore()
    const data: Ref<DataVersions | undefined> = ref()
    const chosen: Ref<DataVersion | undefined> = ref()
    const chosenName: Ref<string | undefined> = ref()
    const versionsList: Ref<string[]> =  ref([] as string[])
    async function fetch(){
        useFetchJson('/json/versions.json', (versions: DataVersions)=>{
            data.value = versions
            chosenName.value = settings.general.versionUsed || data.value.latest
            chosen.value = versions.list[chosenName.value as VersionsAvailable]
            versionsList.value = Object.keys(versions.list)

        })
    }
    function changeVersion(version: string){
        settings.general.versionUsed = version
        chosenName.value = version,
        chosen.value = data.value?.list[version as VersionsAvailable]
        
    }
    watch(chosenName, ()=>{
        gamedata.changeVersion(chosenName.value as VersionsAvailable)
    })
    return {
        fetch,
        changeVersion,
        data,
        chosen,
        chosenName,
        versionsList,

    }
    
})