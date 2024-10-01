import { ref } from 'vue'
import { useRegisterARC } from './arc'

const scrollLenP = ref(0)
export function useScrollGlobalPercent(){
    
    function updateScroll(){
        scrollLenP.value = window.scrollY / document.body.clientHeight * 100
    }
    useRegisterARC('scrollglobalpercent', ()=>{
        window.addEventListener('scroll', updateScroll)
    }, ()=>{
        window.removeEventListener('scroll', updateScroll)
    })
    
    return scrollLenP
}

const scrollLen = ref(window.scrollY)
export function useScrollGlobalRaw(){
    function updateScroll(){
        scrollLen.value = window.scrollY
    }
    useRegisterARC('scrollglobalraw', ()=>{
        window.addEventListener('scroll', updateScroll)
    }, ()=>{
        window.removeEventListener('scroll', updateScroll)
    })
    
    return scrollLen
}