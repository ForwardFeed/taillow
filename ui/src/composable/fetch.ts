import { useErrorStore } from "@/stores/errors";
import { ref, type Ref } from "vue";


export enum FetchState{
    fetching,
    errorFetching,
    parsing,
    errorParsing,
    ok
}

export function useFetchJson<T>(url: string, callback: (t:T)=>void): Ref<FetchState>{
    const errorStore = useErrorStore()
    const state = ref(FetchState.fetching)
    fetch(url)
        .then((res)=>{
            state.value = FetchState.parsing
            const contentType = res.headers.get("content-type");
            if (contentType && !~contentType.indexOf("application/json")){
                res.text()
                    .then((text)=>{
                        state.value = FetchState.errorParsing
                        errorStore.add(`fetching ${url} wasn't json, instead was: ${text}`)
                    })
                    .catch((err)=>{
                        state.value = FetchState.errorParsing
                        errorStore.add(`couldn't parse as text ${url}, reason: ${err}`)
                    })

                return
            }
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
    return state
}

export function useFetchGzip(url: string): Ref<FetchState>{
    const errorStore = useErrorStore()
    const state = ref(FetchState.fetching)
    fetch(url)
        .then((res)=>{
            state.value = FetchState.parsing
            res.blob()
                .then((blob)=>{
                    const ds = new DecompressionStream("gzip");
                    const decompressedStream = blob.stream().pipeThrough(ds);
                    new Response(decompressedStream).json()
                        .then((data: any)=>{
                            console.log(data)
                        })
                        .catch((err)=>{
                            errorStore.add(`fetching ${url} in gzip wasn't json err: ${err}`)
                        })
                })
                .catch((err)=>{
                    state.value = FetchState.errorParsing
                    errorStore.add(`couldn't parse as blob ${url}, reason: ${err}`)
                })
            
        })
        .catch((err)=>{
            // couldn't reach the URL
            state.value = FetchState.errorFetching
            errorStore.add(`couldn't reach ${url}, reason: ${err}`)
        })
    return state
}