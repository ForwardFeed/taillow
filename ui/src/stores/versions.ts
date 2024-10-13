import { ref,type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { DataVersions, DataVersion } from '../../../dataing/types/export_types'
import { useFetchJson } from '@/composable/fetch'
import type { VersionsAvailable } from '../../../dataing/config'
import { useSettingsStore } from './settings'



export const useVersionStore = defineStore('version', () => {

    const settings = useSettingsStore()
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
    return {
        fetch,
        changeVersion,
        data,
        chosen,
        chosenName,
        versionsList,

    }
    
})