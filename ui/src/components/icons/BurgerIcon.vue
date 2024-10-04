<script lang="ts" setup>
    import { useMouseClickStatus, useMouseCoords } from '@/composable/mouse';
    import { ref, watch } from 'vue';
    import BurgerNav from '../BurgerNav.vue';
    import { useScrollGlobalRaw } from '@/composable/scroll';

    const {x, y}    = useMouseCoords()
    const leftPx = ref("0px")
    const topPx = ref("0px")
    let left = 0
    let top = 0
    let currTop = 0 // for smooth scroll
    let targetTop = 0 // for smooth scroll
    let prevX = 0 // relative X before the grabbing
    let prevY = 0
    const isOpened  = ref(false)
    const isHover   = ref(false)
    const isDragged = ref(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function activateBurger(_event: MouseEvent){
        isOpened.value = !isOpened.value
    }
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
        prevX = x.value 
        prevY = y.value 
        isDragged.value = true
        // to reduce the html5 drag and drop visual effect
        const fakeImg = document.createElement('img')
        fakeImg.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        payload.dataTransfer?.setDragImage(fakeImg, 0, 0)
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function drag(payload: DragEvent){
        left += x.value - prevX
        top  += y.value - prevY
        prevX = x.value
        prevY = y.value
        leftPx.value = left + "px"
        currTop =  top + window.scrollY
        topPx.value = currTop + "px"
        
    }
       
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function dragEnd(payload: DragEvent){
        isDragged.value = false
    }

    const clickStatus = useMouseClickStatus()
    watch(clickStatus, function(){
        if (isDragged.value && !clickStatus.value){
            isDragged.value = false
        }
        
    })
</script>
<template>
    <div id="floating-menu-icon" v-bind:class="isHover || isOpened?'burgerOpacity':'burgerOpacityHover'" 
    @mouseover="isHover = true" @mouseleave="isHover = false" @dragstart="dragStart" @drag="drag" @dragend="dragEnd"
    @touchstart="isHover = true; isDragged=true" @touchend="isHover = false;isDragged=false" @drop="dragEnd">
        <img alt="Menu Logo" v-bind:class="isOpened?'burgerTilt':'burgerTiltBack'"
    src="../../assets/burger.png" width="125" height="125" @click="activateBurger"/>
        <div v-show="isOpened"> 
            <BurgerNav/>
        </div>
    </div>
    
</template>
<style scoped>
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
                rotate: 180deg;
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