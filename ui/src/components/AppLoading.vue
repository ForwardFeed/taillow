<script lang="ts" setup>
    import { useInterval } from '@/composable/interval';
    import { ref, type Ref } from 'vue';
    import type { DataVersions } from '../../../dataing/types/types';
    import { AppState, useAppstateStore } from '@/stores/appstate';
import { useVersionStore } from '@/stores/versions';
    const appState = useAppstateStore()
    const storeVersion = useVersionStore()
    // text animation
    const loadingText = ref('Loading...')
    useInterval((iterationCount: number)=>{
        loadingText.value = `Loading${".".repeat(iterationCount % 4)}`
    }, 270)
    // load stuff
    type ResultLoading = {
        success: boolean,
        text: string,
        time: number,
    }

    const resultLoading: Ref<ResultLoading[]> = ref([])
    function pushResultLoading(success: boolean, text: string){
        resultLoading.value.push({
            success: success,
            text: text,
            time: Date.now() - timeA
        })
    }
    const timeA = Date.now()
    fetch('json/versions.json')
        .then((res)=>{
            res.json()
                .then((versions: DataVersions)=>{
                    pushResultLoading(true, 'Loading versions')
                    storeVersion.setData(versions)
                })
                .catch((err)=>{
                    pushResultLoading(false, 'Parsing versions, ' + err)
                })
        })
        .catch((err)=>{
            // do stuff with error
            pushResultLoading(false, 'Accessing versions, ' + err)
        })
        .finally(()=>{
            appState.changeState(AppState.ok)
        })


    
    
</script>
<template>
    <main>
        <div class="loading-main">
            {{  loadingText  }}
        </div>
        <div class="loading-sub">
            <li v-for="(result, index) in resultLoading" :key="index">
                <template v-if="result.success">
                    <span class="success">
                        Success: {{ result.text }} in {{ result.time }}ms
                    </span>
                   
                </template>
                <template v-else>
                    <span class="failure">
                        Failure: {{ result.text }} in {{ result.time }}ms
                    </span>
                </template>
            </li>
        </div>
    </main>
    
</template>
<style scoped>
    main{
        margin: auto;
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .loading-main{
        font-size: 2em;
        width: fit-content;
        margin: auto;
    }
    .loading-sub{
        margin: auto;
    }
</style>