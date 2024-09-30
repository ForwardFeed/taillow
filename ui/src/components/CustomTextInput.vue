<script lang="ts" setup>
import { onMounted, ref } from 'vue';



    interface Props{
        value: string
        active?: boolean
    }
    const props = withDefaults(defineProps<Props>(), {
        value: "",
        active: false,
    })
    onMounted(()=>{
        if (props.active)
            inputRef.value.focus()
    })
    const inputRef = ref()
    function onkeyup(){
        console.log(inputRef.value.value)
    }
</script>
<template>
    <!-- I wish I could ask kindly phone users to open their keyboard without needing an input focused, in 2050 probably-->
    <input type="text" :value="props.value" ref="inputRef" @keyup="onkeyup">
</template>
<style scoped>
    
</style>