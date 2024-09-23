<script lang="ts" setup>
import { useMouseRightClickStatus, useMouseCoords } from '@/composable/mouse';
import { ref, watch } from 'vue';
import { computed } from 'vue';
    const {x, y}    = useMouseCoords()
    const leftPx = ref("0px")
    const topPx = ref("0px")
    let left = 0
    let top = 0
    let prevX = 0 // relative X before the grabbing
    let prevY = 0
    const isOpened  = ref(false)
    const isHover   = ref(false)
    const isDragged = ref(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function activateBurger(_event: MouseEvent){
        isOpened.value = !isOpened.value
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function dragStart(payload: DragEvent){
        prevX = x.value 
        prevY = y.value 
        isDragged.value = true
        // to reduce the html5 drag and drop visual effect
        const target = payload.target as HTMLElement
        payload.dataTransfer?.setDragImage(target, 0, 0)
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function drag(payload: DragEvent){
        left += x.value - prevX
        top  += y.value - prevY
        prevX = x.value
        prevY = y.value
        leftPx.value = left + "px"
        topPx.value = top + "px"
        
    }   
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function dragEnd(_payload: DragEvent){
        isDragged.value = false
    }

    const clickStatus = useMouseRightClickStatus()
    watch(clickStatus, function(){
        if (isDragged.value && !clickStatus.value){
            isDragged.value = false
            console.log('left')
        }
        
    })
</script>
<template>
    <div id="floating-menu-icon" v-bind:class="isHover || isOpened?'burgerOpacity':'burgerOpacityHover'" 
    @mouseover="isHover = true" @mouseleave="isHover = false" @dragstart="dragStart" @drag="drag" @dragend="dragEnd"
    @touchstart="isHover = true; isDragged=true" @touchend="isHover = false;isDragged=false" @drop="dragEnd">
        <img alt="Menu Logo" v-bind:class="isOpened?'burgerTilt':'burgerTiltBack'"
    src="../../assets/burger.png" width="125" height="125" @click="activateBurger"/>
        <div v-show="isOpened"> opened</div>
    </div>
    
</template>
<style>
    #floating-menu-icon{
        position: absolute;
        top: v-bind(topPx);
        left: v-bind(leftPx);
    }
    img{
        width: 5em;
        height: 5em;
        image-rendering: pixelated;
    }
    .burgerTilt{
        animation-duration: 1s;
        animation-name: burgerTilt;
        animation-iteration-count: 1;
        animation-fill-mode: forwards;
    }
    .burgerTilt::after{
        transform: rotate(90deg);
    }
    .burgerTiltBack{
        animation-duration: 1s;
        animation-name: burgerTiltBack;
        animation-iteration-count: 1;
    }
    @keyframes burgerTilt {
            from {
                rotate: 0;
            }
            to {
                transform: rotate(90deg);
            }
    } 
    @keyframes burgerTiltBack {
            from {
                rotate: 90deg;
            }
            to {
                rotate: 0;
            }
   } 
   .burgerOpacity{
        animation-duration: 1s;
        animation-name: burgerOpacity;
        animation-iteration-count: 1;
        animation-fill-mode: forwards;
   }
   .burgerOpacityHover{
        animation-duration: 1s;
        animation-name: burgerOpacityHover;
        animation-iteration-count: 1;
        animation-fill-mode: forwards;
   }
   @keyframes burgerOpacity {
        from {
            opacity: 0.3;
        }
        to {
            opacity: 1;
        }
   }
   @keyframes burgerOpacityHover {
    from {
            opacity: 1;
        }
        to {
            opacity: 0.3;
        }
   }
</style>