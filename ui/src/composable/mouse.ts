import { ref, onMounted, onUnmounted, type Ref } from 'vue'

// by convention, composable function names start with "use"
export function useMouseCoords() {
    // state encapsulated and managed by the composable
    const x = ref(0)
    const y = ref(0)

    // a composable can update its managed state over time.
    function update(event: any) {
        x.value = event.pageX
        y.value = event.pageY
    }
    function updateTouch(payload: TouchEvent){
        x.value  = payload.targetTouches[0].pageX
        y.value  = payload.targetTouches[0].pageY
    }
    
    // a composable can also hook into its owner component's
    // lifecycle to setup and teardown side effects.
    onMounted(() => window.addEventListener('mousemove', update))
    onUnmounted(() => window.removeEventListener('mousemove', update))
    onMounted(() => window.addEventListener('dragover', update))
    onUnmounted(() => window.removeEventListener('dragover', update))
    onMounted(()=> window.addEventListener('touchmove', updateTouch))
    onUnmounted(() => window.removeEventListener('touchmove', updateTouch))
    // expose managed state as return value
    return { x, y }
}
const mouseDown   = ref(false)
let  ARCMousedown = 0
export function useMouseClickStatus(){

    function updateDown(){
        mouseDown.value = true
    }
    function updateUp(){
        mouseDown.value = false
    }
    onMounted(()=>{
        if(ARCMousedown++){
            return
        }
        window.addEventListener('mousedown', updateDown)
        window.addEventListener('mouseup', updateUp)
    })
    onUnmounted(()=>{
        if (--ARCMousedown){
            return
        }
        window.removeEventListener('mousedown', updateDown)
        window.removeEventListener('mouseup', updateUp  )
    })
    return mouseDown
}

type ClickOutsideTrigger = {
    target: Ref<HTMLElement | undefined>,
    comRef: Ref<number>
}
const listOfClickOutsideTrigger = [] as ClickOutsideTrigger[]
let clickOutsideARC = 0
const NUMBER_OF_PARENT_MAX = 3
export function useMouseClickedOutside(target: Ref<HTMLElement | undefined>){

    // return true if the target send is equal to the node to compare to or one of its parent
    // TTL (time to live) is the number max of upward recursion allowed
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
        for (const trigger of listOfClickOutsideTrigger){
            if (!trigger.target.value)
                continue
            if (recursivelyFindNodeEquality(target, trigger.target.value)){
                trigger.comRef.value++
            }
        }
    }
    const comRef = ref(0)
    listOfClickOutsideTrigger.push({
        target: target,
        comRef: comRef
    })
    onMounted(()=>{
        if(clickOutsideARC++){
            return
        }
        window.addEventListener('mouseup', update)
    })
    onUnmounted(()=>{
        if (--clickOutsideARC){
            return
        }
        window.removeEventListener('mouseup', update)
    })
    
    return comRef
}