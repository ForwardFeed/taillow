import { ref, type Ref } from 'vue'
import { useRegisterARC } from './arc'

const x = ref(0)
const y = ref(0)
export function useMouseCoords() {

    function update(event: any) {
        x.value = event.pageX
        y.value = event.pageY
    }
    function updateTouch(payload: TouchEvent){
        x.value  = payload.targetTouches[0].pageX
        y.value  = payload.targetTouches[0].pageY
    }
    
    useRegisterARC('usemousecoords', ()=>{
        window.addEventListener('mousemove', update)
        window.addEventListener('dragover', update)
        window.addEventListener('touchmove', updateTouch)
    }, ()=>{
        window.removeEventListener('mousemove', update)
        window.removeEventListener('dragover', update)
        window.removeEventListener('touchmove', updateTouch)
    })

    return { x, y }
}

const mouseClickStatusRef   = ref(false)
export function useMouseClickStatus(){
    const updateDown = () => {
        mouseClickStatusRef.value = true
    }
    const updateUp = () => {
        mouseClickStatusRef.value = false
    }
    useRegisterARC("mouseclickstatus", ()=>{
        window.addEventListener('mousedown', updateDown)
        window.addEventListener('touchstart', updateDown)
        window.addEventListener('mouseup', updateUp)
        window.addEventListener('touchend', updateUp)
    }, ()=>{
        window.removeEventListener('touchstart', updateDown)
        window.removeEventListener('mousedown', updateDown)
        window.removeEventListener('mouseup', updateUp)
        window.removeEventListener('touchend', updateUp)
    })
    return mouseClickStatusRef
}

type ClickOutsideTrigger = {
    target: Ref<HTMLElement | undefined>,
    comRef: Ref<number>
}
const listOfClickOutsideTargets = [] as ClickOutsideTrigger[]

const NUMBER_OF_PARENT_MAX = 3
export function useMouseClickedOutside(target: Ref<HTMLElement | undefined>){

    // return true if the target send is equal to the node to compare to or one of its parent
    // TTL (turn to live) is the number max of upward recursion allowed
    function recursivelyFindNodeEquality(
        target: HTMLElement, compareNode: HTMLElement, TTL = NUMBER_OF_PARENT_MAX): boolean{
        if (target.isEqualNode(compareNode))
            return true
        if (TTL == 0)
            return false
        const parentNode = compareNode.parentElement
        if (parentNode == null)
            return false
        return recursivelyFindNodeEquality(target, parentNode, TTL - 1)

    }

    function update(event: MouseEvent){
        const target = event.target as HTMLElement
        for (const trigger of listOfClickOutsideTargets){
            if (!trigger.target.value)
                continue
            if (recursivelyFindNodeEquality(target, trigger.target.value)){
                trigger.comRef.value++
            }
        }
    }
    const comRef = ref(0)
    listOfClickOutsideTargets.push({
        target: target,
        comRef: comRef
    })
    useRegisterARC("mouseclickedoutside", ()=>{
        window.addEventListener('mouseup', update)
    }, ()=>{
        window.removeEventListener('mouseup', update)
    })
    
    return comRef
}