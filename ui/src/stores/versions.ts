import { ref,watch,type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { DataVersions, DataVersion } from '../../../dataing/src/exporter/types'
import { useFetchJson } from '@/composable/fetch'
import type { VersionsAvailable } from '../../../dataing/config'
import { useSettingsStore } from './settings'
import { changeGamedataVersion } from './gamedata'
import { wrapperLocalStorage } from '@/utils/localstorage'



export const useVersionStore = defineStore('version', () => {

    const settings = useSettingsStore()
    const data: Ref<DataVersions | undefined> = ref()
    const chosenVersionData: Ref<DataVersion | undefined> = ref()
    const chosenVersionName: Ref<string | undefined> = ref()
    const versionsList: Ref<string[]> =  ref([] as string[])
    async function fetch(){
        useFetchJson('/json/versions.json', (versions: DataVersions)=>{
            data.value = versions
            chosenVersionName.value = settings.general.versionUsed || data.value.latest
            chosenVersionData.value = versions.list[chosenVersionName.value as VersionsAvailable]
            versionsList.value = Object.keys(versions.list)

        }, true)
    }
    function changeVersionUsed(version: string){
        settings.general.versionUsed = version
        chosenVersionName.value = version,
        chosenVersionData.value = data.value?.list[version as VersionsAvailable]
        
    }
    watch(chosenVersionName, ()=>{
        // in the version data, there's a date field, and if the date field has been updated
        // then update the data
        const currentVersion = chosenVersionName.value as VersionsAvailable
        const storedVersionDate = wrapperLocalStorage.getItem(`lastDate${currentVersion}`)
        let shouldForceUpdate = false
        if (chosenVersionData.value && storedVersionDate !== chosenVersionData.value.date + ""){
            shouldForceUpdate = true
            console.log("version has been updated, force updating")
            wrapperLocalStorage.setItem(`lastDate${currentVersion}`, chosenVersionData.value.date + "")
        }
        
        changeGamedataVersion(chosenVersionName.value as VersionsAvailable, shouldForceUpdate)
    })
    return {
        fetch,
        changeVersion: changeVersionUsed,
        data,
        chosenVersionData,
        chosenVersionName,
        versionsList,

    }
    
})