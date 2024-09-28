export enum AppState{
    loading,
    err,
    ok
}

import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppstateStore = defineStore('appstate', () => {
    const state = ref(AppState.loading)
    const changeState = function(pState: AppState){
        state.value = pState
    }

    return { state, changeState}
})
