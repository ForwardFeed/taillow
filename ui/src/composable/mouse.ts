import { ref, type Ref } from 'vue'
import { useRegisterARC } from './arc'

const x = ref(0)
const y = ref(0)

/**This function must wait an user input before its values are initialiazed
 * until a mouse mouvement it's done, this will always be 0,0
 * So sometimes you may want to setup it up early
 */
export function useMouseCoords() {
    
    function update(event: any) {
        x.value = event.pageX
        y.value = event.pageY
    }
    function updateTouch(payload: TouchEvent){
        x.value  = payload.targetTouches[0].clientX
        y.value  = payload.targetTouches[0].clientY
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

type ClickOutsideNodeTrigger = {
    target: Ref<HTMLElement | undefined>,
    comRef: Ref<number>
}
const listOfClickOutsideNodeTargets = [] as ClickOutsideNodeTrigger[]

const NUMBER_OF_PARENT_MAX = 3
export function useMouseClickedOutsideNode(target: Ref<HTMLElement | undefined>){

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
        for (const trigger of listOfClickOutsideNodeTargets){
            if (!trigger.target.value)
                continue
            if (!recursivelyFindNodeEquality(target, trigger.target.value)){
                trigger.comRef.value++
            }
        }
    }
    const comRef = ref(0)
    listOfClickOutsideNodeTargets.push({
        target: target,
        comRef: comRef
    })
    useRegisterARC("mouseclickedoutsidenode", ()=>{
        window.addEventListener('mouseup', update)
    }, ()=>{
        window.removeEventListener('mouseup', update)
    })
    
    return comRef
}


type ClickOutsideClassTrigger = {
    classTarget: string,
    comRef: Ref<number>
}
const listOfClickOutsideClassTargets = [] as ClickOutsideClassTrigger[]

export function useMouseClickedOutsideClass(classTarget: string){

    // return true if the target to compare or one of its parent has a class target
    // TTL (turn to live) is the number max of upward recursion allowed
    function recursivelyFindNodeClass(
        classTarget: string, targetNode: HTMLElement, TTL = NUMBER_OF_PARENT_MAX): boolean{
        if (!targetNode.classList)
            return false
        if (targetNode.classList.contains(classTarget))
            return true
        if (TTL == 0)
            return false
        const parentNode = targetNode.parentElement
        if (parentNode == null)
            return false
        return recursivelyFindNodeClass(classTarget, parentNode, TTL - 1)

    }

    function update(event: MouseEvent){
        const target = event.target as HTMLElement
        for (const trigger of listOfClickOutsideClassTargets){
            if (!recursivelyFindNodeClass(trigger.classTarget, target)){
                trigger.comRef.value++
            }
        }
    }
    const comRef = ref(0)
    listOfClickOutsideClassTargets.push({
        classTarget,
        comRef
    })
    useRegisterARC("mouseclickedoutsideclass", ()=>{
        window.addEventListener('mouseup', update)
    }, ()=>{
        window.removeEventListener('mouseup', update)
    })
    
    return comRef
}