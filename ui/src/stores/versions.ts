import {ref } from 'vue'
import { defineStore } from 'pinia'
import type { DataVersions, DataVersion } from '../../../dataing/types/types'

export const useVersionStore = defineStore('version', () => {
    const versions     = ref({} as DataVersions)
    const chosenVersion = ref({} as DataVersion)
    const chosenVersionName = ref("")
    const chosenCommit = ref("")
    const versionsList = ref([] as string[])
    function setData(data: DataVersions) {
        versions.value = data
        setVersion(data.latest)
    }
    function setVersion(version: string){
        chosenVersionName.value = version
        //@ts-ignore
        chosenVersion.value = versions.value.list[version]
        chosenCommit.value = chosenVersion.value.commit
        versionsList.value = getListOfVersion()
    }
    function getDate(): number{
        return chosenVersion.value.date
    }
    function getListOfVersion(){
        if (!versions.value.list) return []
        return Object.keys(versions.value.list)
    }
    return {
        versions,
        chosenVersionName,
        setData,
        setVersion,
        chosenCommit,
        getDate,
        versionsList
    }
})
