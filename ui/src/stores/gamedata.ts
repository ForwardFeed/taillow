import { markRaw, ref, type Ref } from 'vue'
import type { VersionsAvailable } from '../../../config'
import { useFetchGzip } from '@/composable/fetch'
import { assertUnreachable } from '@/utils/utils'
import { wrapperLocalStorage, type AllowedSaveableGameData } from '@/utils/localstorage'
import type { CompactGameData } from './gamedata_type'
import { buildClientGeneratedData } from '@/data/client_generated_data'

/**
 * This file is an exception, I removed the store from it because i wasn't sure about it
*/

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

function exposeGameData(gamedata: CompactGameData){
    // exposing gamedata to the console for some power users
    //@ts-ignore 
    window.gamedata = gamedata
    console.log(gamedata)
}

/**
 * Since it's as huge object, I don't know well pinia will handle it
 * I'm already hesitating to put it into a ref even it's marked a raw
 */

export const gamedata: Ref<CompactGameData> = ref(markRaw({
    species: [],
    abilities: [],
    trainers: [],
    moves: [],
    worldMaps: [],


    // indexes
    types: [],
    items: [],
    natures:[],

    evoKindsT: [],

    moveFlagsT: [],
    moveFlagsBanT: [],
    //moveEffectT: [],
    moveCategoryT: [],

    trainerClasses: [],
    //trainerPic:[],
    //trainerAIs: [],
    
    
    encounterFields: [],

    // Clientside build data
    b_species_stats: []
}))


export function changeGamedataVersion(version: VersionsAvailable, forceRefresh = false) {
    const storeAndKey = getUrlAndStorageKeyOfVersion(version)
    const gamedataStr = wrapperLocalStorage.getItem(storeAndKey.localStorageKey)
    if (!gamedataStr || forceRefresh){
        console.log(`taking ${version} from server`)
        useFetchGzip(storeAndKey.path, (gamedataServer: CompactGameData)=>{
            gamedata.value = markRaw(gamedataServer)
            exposeGameData(gamedata.value)
            buildClientGeneratedData(gamedataServer)
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
                return changeGamedataVersion(version)
        }
        console.log(`success decompressing ${version} from storage`)
        const ds = new DecompressionStream("gzip");
        const decompressedStream = blob.stream().pipeThrough(ds);
        new Response(decompressedStream).json()
            .then((gamedataStorage)=>{
               console.log(`success taking ${version} from storage`)
               gamedata.value = markRaw(gamedataStorage)
               exposeGameData(gamedata.value)
               buildClientGeneratedData(gamedataStorage)
            })
            .catch((err)=>{
                console.log(`failure taking ${version} from storage: ${err}`)
            })
    }
}

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
