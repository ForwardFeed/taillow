import { useErrorStore } from "@/stores/errors";
import { ref } from "vue";


export enum FetchState{
    fetching,
    errorFetching,
    parsing,
    errorParsing,
    ok
}

export function useFetchJson<T>(url: string, callback: (t:T)=>void){
    const errorStore = useErrorStore()
    const state = ref(FetchState.fetching)
    fetch(url)
        .then((res)=>{
            state.value = FetchState.parsing
            res.json()
                .then((versions: T)=>{
                    state.value = FetchState.ok
                    callback(versions)
                })
                .catch((err)=>{
                    state.value = FetchState.errorParsing
                    errorStore.add(`couldn't parse ${url}, reason: ${err}`)
                })
        })
        .catch((err)=>{
            // couldn't reach the URL
            state.value = FetchState.errorFetching
            errorStore.add(`couldn't reach ${url}, reason: ${err}`)
        })
}