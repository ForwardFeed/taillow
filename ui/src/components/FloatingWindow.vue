<script lang="ts" setup>
    import { useMouseClickStatus, useMouseCoords } from '@/composable/mouse';
    import { useScrollGlobalRaw } from '@/composable/scroll';
    import { ref, watch } from 'vue';


    const {x, y}    = useMouseCoords()
    const leftPx = ref("0px")
    const topPx = ref("0px")
    let left = 0
    let top = 0
    let currTop = 0 // for smooth scroll
    let targetTop = 0 // for smooth scroll
    let prevX = 0 // relative X before the grabbing
    let prevY = 0
    const isDragged = ref(false)

    watch(useScrollGlobalRaw(), ()=>{
        targetTop = top + window.scrollY
        // 2% speed
        const stepIncrease = Math.round((targetTop - currTop) / 50)
        //smooth trailling
        window.requestAnimationFrame(function step() {
            if (currTop >= targetTop){
                topPx.value = targetTop + "px"
                return
            }
            currTop+= stepIncrease
            topPx.value = currTop + "px"
            window.requestAnimationFrame(step)

        })
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
        left += x.value - prevX
        top  += y.value - prevY
        prevX = x.value
        prevY = y.value
        leftPx.value = left + "px"
        currTop =  top + window.scrollY
        topPx.value = currTop + "px"
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
    

</script>
<template>
    <div class="floating-window" @dragstart="dragStart" @dragend="dragEnd" @drop="dragEnd" 
    @mousedown="vDragStart" @mouseup="vDragEnd"
    @touchstart="isDragged=true" @touchend="isDragged=false" >
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