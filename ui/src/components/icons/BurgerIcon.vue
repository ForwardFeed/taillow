<script lang="ts" setup>
    import { ref } from 'vue';
    import BurgerNav from '../BurgerNav.vue';
    import FloatingWindow from '../FloatingWindow.vue';

    const isOpened  = ref(false)
    const isHover   = ref(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function activateBurger(_event: MouseEvent){
        isOpened.value = !isOpened.value
    }

</script>
<template>
    <FloatingWindow>
        <div v-bind:class="isHover || isOpened?'burgerOpacity':'burgerOpacityHover'" 
        @mouseover="isHover = true" @mouseleave="isHover = false" @touchstart="isHover = true"
        @touchend="isHover = false">
            <img alt="Menu Logo" v-bind:class="isOpened?'burgerTilt':'burgerTiltBack'" 
        src="../../assets/burger.png" width="125" height="125" @click="activateBurger"/>
            <div v-show="isOpened"> 
                <BurgerNav/>
            </div>
        </div>
       
    </FloatingWindow>
    
</template>
<style scoped>
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
    .burgerOpacity, .burgerOpacityHover{
        user-select: none;
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