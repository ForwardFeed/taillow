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
    const ARC = containerARC[nameId]
    
    if (!ARC){
        return containerARC[nameId] = {
            count: 0,
            onMount: onMount,
            onDismount: onDismount,
        }
    }

    return ARC
}
/**
 * Ensure that a composable on mount and on dismount are used only once
 * Use it if you don't want n more useless window.addEventListener
 */
export function useRegisterARC(nameId: string, onMountFirstOnly: ()=>void, onDismountLastOnly: ()=>void){
    const ARC = getOrCreateArc(nameId, onMountFirstOnly, onDismountLastOnly)
    onMounted(()=>{
        // if it's already mounted don't mount it one more time
        if (ARC.count++){
            return
        }
        ARC.onMount()
    })
    onUnmounted(()=>{
        // if it's not the last one to be dismounted, don't dismount it
        if (--ARC.count){
            return
        }
        ARC.onDismount()
    })
}