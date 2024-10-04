import { reactive, ref, type Reactive, type Ref } from 'vue'
import { defineStore } from 'pinia'


export const useErrorStore = defineStore('errors', () => {
    const list: Reactive<string[]> = reactive([] as string[])
    const notifications: Ref<number> = ref(0)
    function add(err: string){
        list.push(err)
        notifications.value++
    }
    function clear(){
        list.length = 1;
        notifications.value = 0
    }
    function setAsRead(){
        notifications.value = 0
    }
    return {
        list,
        notifications,
        add,
        clear,
        setAsRead
    }
})
