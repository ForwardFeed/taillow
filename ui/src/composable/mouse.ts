import { ref, onMounted, onUnmounted } from 'vue'

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

export function useMouseRightClickStatus(){
  const mouseDown = ref(false)
  function updateDown(){
    mouseDown.value = true
  }
  function updateUp(){
    mouseDown.value = false
  }
  onMounted(()=> window.addEventListener('mousedown', updateDown  ))
  onUnmounted(()=> window.removeEventListener('mousedown', updateDown  ))
  onMounted(()=> window.addEventListener('mouseup', updateUp  ))
  onUnmounted(()=> window.removeEventListener('mouseup', updateUp  ))

  return mouseDown
}