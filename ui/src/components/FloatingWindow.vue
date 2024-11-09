<script lang="ts" setup>
import { useMouseClickStatus, useMouseCoords } from '@/composable/mouse';
import { useScrollGlobalRaw } from '@/composable/scroll';
import { onMounted, ref, watch, type Ref } from 'vue';

interface Props{
    startingX?: number
    startingY?: number
    onMouseCursor?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    startingX:  0,
    startingY: 0,
    onMouseCursor: false,
})

const {x, y}    = useMouseCoords()

let initX = props.onMouseCursor ? x.value: props.startingX
let initY =  props.onMouseCursor ? y.value: props.startingY

const leftPx = ref(initX + "px")
const topPx = ref(initY + "px")

const initScrollY = window.scrollY
let left = initX
let top = initY
let currTop = top + initScrollY // used for smooth scroll
let targetTop = 0 // for smooth scroll
let prevX = initX // relative X before the grabbing
let prevY = initY
const isDragged = ref(false)

let timeoutSmoothTrail: number | null = null
watch(useScrollGlobalRaw(), ()=>{
    targetTop = top + window.scrollY
    // 2% speed
    const stepIncrease = Math.round((targetTop - currTop) / 50)
    if (timeoutSmoothTrail)
        clearTimeout(timeoutSmoothTrail)
    //smooth trailling 
    timeoutSmoothTrail = setTimeout(()=>{
        window.requestAnimationFrame(function step() {
        if ((stepIncrease > 0) ? currTop >= targetTop : currTop <= targetTop){
                topPx.value = targetTop - initScrollY + "px"
                currTop = targetTop
                return
            }
            currTop += stepIncrease
            topPx.value = currTop - initScrollY  + "px"
        
        window.requestAnimationFrame(step)

    })
    }, 100)
    
})

function dragStart(payload: DragEvent){
    // to reduce the html5 drag and drop visual effect
    const fakeImg = document.createElement('img')
    fakeImg.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    payload.dataTransfer?.setDragImage(fakeImg, 0, 0)
}
function dragEnd(){
    isDragged.value = false
}
// Touchpads don't support drag events
// so this is a workaround
watch(()=>x.value + y.value, function(){
    if (!isDragged.value)
        return
    const rect = floatingWin.value?.getClientRects()?.[0] || {} as DOMRect
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    const maxLeft = vw - rect.width
    const maxTop = vh - rect.height
    left += x.value - prevX
    top  += y.value - prevY
    
    prevX = x.value
    prevY = y.value
    // prevent the window from being moved out of bonds
    if (left <= 0){
        prevX = 0
        left = 0
    }
    if (left >= maxLeft){
        prevX = maxLeft
        left = maxLeft
    }
    if (top <= 0){
        prevY = 0
        top = 0
    }
    if (top >= maxTop){
        prevY = maxTop
        top = maxTop
    }
    // changing the position with inline css
    leftPx.value = left + "px"
    currTop = top + window.scrollY
    topPx.value = currTop - initScrollY + "px"
})

function vDragStart(){
    prevX = x.value 
    prevY = y.value 
    isDragged.value = true
}

function vDragEnd(){
    isDragged.value = false
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars


const clickStatus = useMouseClickStatus()
watch(clickStatus, function(){
    if (isDragged.value && !clickStatus.value){
        isDragged.value = false
    }
    
})

//preventing window from spawning out of bounds
onMounted(()=>{
    const rect = floatingWin.value?.getClientRects()?.[0] || {width:0, height: 0} as DOMRect
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    if (left + rect.width > vw){
        left = vw - rect.width
        prevX = left
        leftPx.value = left + "px"
    }
    if (top - initScrollY + rect.height > vh){
        top = vh - rect.height
        prevY = top
        currTop = top + window.scrollY
        topPx.value = currTop + "px"
    }
})


const floatingWin: Ref<undefined | HTMLElement> = ref()

</script>
<template>
    <div class="floating-window" ref="floatingWin"
    @dragstart="dragStart" @dragend="dragEnd" @drop="dragEnd" 
    @mousedown="vDragStart" @mouseup="vDragEnd" 
    @touchstart="isDragged=true" @touchend="isDragged=false" @touchmove.prevent="">
        <slot></slot>
    </div>
</template>
<style scoped >
    .floating-window{
        position: absolute;
        top: v-bind(topPx);
        left: v-bind(leftPx);
    }
</style>