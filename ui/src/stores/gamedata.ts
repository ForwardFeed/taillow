import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { AllCompactGamedata } from '../../../dataing/src/exporter/types'
import type { VersionsAvailable } from '../../../dataing/config'
import { useFetchGzip } from '@/composable/fetch'
import { assertUnreachable } from '@/utils/utils'
import { wrapperLocalStorage, type AllowedSaveableGameData } from '@/utils/localstorage'

function getUrlAndStorageKeyOfVersion(version: VersionsAvailable): {
    path: string, // GZIP !
    localStorageKey: AllowedSaveableGameData
}{
    const path = `/gzip/gamedataV${version}.gzip`
    switch(version){
        case "vanilla":
            return {
                path: path,
                localStorageKey: `gamedataV${version}`
            }
        case "ER2.5":
            return {
                path: path,
                localStorageKey: `gamedataV${version}`
            }
    }
    return assertUnreachable(version)
}

function exposeGameData(gamedata: AllCompactGamedata){
    // exposing gamedata to the console for some power users
    //@ts-ignore 
    window.gamedata = gamedata
}



export const useGamedataStore = defineStore('gamedata', () => {
    const gamedata: Ref<AllCompactGamedata> = ref({
        species: [],
        abilities: [],
        trainers: [],
        moves: [],
        maps: [],


        // indexes
        types: [],
        items: [],
        natures:[],

        trainerClass:[],
        trainerPic:[],
        trainerAIs: [],

        moveFlagsT: [],
        moveFlagsBanT: [],
        moveEffectT: [],
        moveCategory: [],

        encounterFields: [],
    })
    
    function changeVersion(version: VersionsAvailable, forceRefresh = false) {
        const storeAndKey = getUrlAndStorageKeyOfVersion(version)
        const gamedataStr = wrapperLocalStorage.getItem(storeAndKey.localStorageKey)
        if (!gamedataStr || forceRefresh){
            console.log(`taking ${version} from server`)
            useFetchGzip(storeAndKey.path, (gamedataServer: AllCompactGamedata)=>{
                gamedata.value = gamedataServer
                onGameDataChange()
                console.log(`sucess taking ${version} from server`)
            }, storeAndKey.localStorageKey)
        } else {
            console.log(`decompressing ${version} from storage`)
            let blob
            try{
                const parsed = readHeaderOfBlob(gamedataStr)
                blob = b64toBlob(parsed.data, parsed.contentType)
            } catch(err){
                    console.error(`failed decompressing ${version} gamedata: ${err}.
removing ${storeAndKey.localStorageKey} from localstorage and retrying`)
                    wrapperLocalStorage.rmItem(storeAndKey.localStorageKey)
                    return changeVersion(version)
            }
            console.log(`success decompressing ${version} from storage`)
            const ds = new DecompressionStream("gzip");
            const decompressedStream = blob.stream().pipeThrough(ds);
            new Response(decompressedStream).json()
                .then((gamedataStorage)=>{
                   console.log(`success taking ${version} from storage`)
                   gamedata.value = gamedataStorage
                   onGameDataChange()
                })
                .catch((err)=>{
                    console.log(`failure taking ${version} from storage: ${err}`)
                })
        }
    }
    function onGameDataChange(){
        exposeGameData(gamedata.value)
        gamedataUpdateCount.value++
    }
    // changes whenever gamedata is updated
    const gamedataUpdateCount = ref(0)
    return { 
        gamedata,
        changeVersion,
        gamedataCount: gamedataUpdateCount
    }
})

function readHeaderOfBlob(blobB64Data: string){
    const strToMatch = "data:application/octet-stream;base64,"
    if (blobB64Data.substring(0, strToMatch.length) !== strToMatch){
        throw "unexpected blob header"
    }
    return {
        contentType: "data:application/octet-stream",
        data: blobB64Data.substring(strToMatch.length)
    }
}

// thanks https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
function b64toBlob(b64Data: string, contentType='', sliceSize=512){
    
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
        
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
}
