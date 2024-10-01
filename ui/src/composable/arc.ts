import { onUnmounted, onMounted } from "vue"

type AtomicallyReferencedCounted = {
    count: number,
    onMount: ()=>void,
    onDismount: ()=>void,
}

type ContainerARC = Record<string, AtomicallyReferencedCounted>

const containerARC: ContainerARC = {

}

function getOrCreateArc(nameId: string, onMount: ()=>void, onDismount: ()=>void): AtomicallyReferencedCounted{
    const ARCT = containerARC[nameId]
    
    if (!ARCT){
        return containerARC[nameId] = {
            count: 0,
            onMount: onMount,
            onDismount: onDismount,
        }
    }

    return ARCT
}
/**
 * Ensure that a composable on mount and on dismount are used only once
 * Use it if you don't want n more useless window.addEventListener
 */
export function useRegisterARC(nameId: string, onMountFirstOnly: ()=>void, onDismountLastOnly: ()=>void){
    const ARCT = getOrCreateArc(nameId, onMountFirstOnly, onDismountLastOnly)
    onMounted(()=>{
        console.log("try mounted")
        if (ARCT.count++){
            return
        }
        console.log("mounted")
        ARCT.onMount()
    })
    onUnmounted(()=>{
        console.log("try un mounted")
        if (--ARCT.count){
            return
        }
        console.log("un mounted")
        ARCT.onDismount()
    })
}