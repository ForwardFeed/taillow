import { onMounted, onUnmounted } from "vue";

// calls a callback every x ms (default 1 second)
export function useInterval(callback: (nIteration: number)=> void, time = 1000){
    let timer: null | number = null;
    let iterationCount = 0
    // callback that integrates iterations count
    const innerCallback = ()=>{
        callback(iterationCount++)
        timer = setTimeout(()=>{
            innerCallback()
        }, time)
    }

    function start(){
        stop()
        timer = setTimeout(()=>{
            innerCallback()
        }, time)
    }

    function stop(){
        if(timer !== null){
            clearInterval(timer)
            timer = null
        }
    }

    onMounted(start)
    onUnmounted(stop)

    return {start, stop}
}