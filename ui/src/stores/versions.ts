import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { DataVersions, DataVersion } from '../../../dataing/types/types'

export const useVersionStore = defineStore('version', () => {
    const versions     = ref({} as DataVersions)
    const chosenVersion = ref({} as DataVersion)
    const chosenVersionName = ref("")
    function setData(data: DataVersions) {
        versions.value = data
        setVersion(data.latest)
    }
    function setVersion(version: string){
        chosenVersionName.value = version
        //@ts-ignore
        chosenVersion.value = versions.value.list[version]
        console.log(chosenVersion.value.commit)
    }
    function getCommit(){
       return chosenVersion.value.commit
    }
    function getDate(){
      return chosenVersion.value.date
   }
    return { 
        versions,
        chosenVersion,
        chosenVersionName,
        setData,
        setVersion,
        getCommit,
        getDate,
    }
})
