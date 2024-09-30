import { ref, onMounted, onUnmounted } from 'vue'

export function useGlobalScroll() {
    const scrollLen = ref(0)
    function updateScroll(ev: Event){
        scrollLen.value++
    }
    onMounted(()=>{window.addEventListener('scroll', updateScroll)})
    onUnmounted(()=>{window.removeEventListener('scroll', updateScroll)})
    return scrollLen
}