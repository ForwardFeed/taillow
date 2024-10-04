import { reactive, type Reactive } from 'vue'
import { defineStore } from 'pinia'


type GlobalErrors = {
    modalStatus: boolean,
    list: string[],
    notifications: number,
    add: (err: string)=>void,
}

const _globalErrors: GlobalErrors = {
    modalStatus: false,
    list: [],
    notifications: 0,
    add(err: string){
        this.list.push(err)
        this.notifications++
    },
}

const globalErrors: Reactive<GlobalErrors> = reactive(_globalErrors)

//typescript intellisense isn't as great as I wished it to be, that's why _globalErrors and globalErrors

export const useErrorStore = defineStore('errors', () => {
    return {
        globalErrors
    }
})
