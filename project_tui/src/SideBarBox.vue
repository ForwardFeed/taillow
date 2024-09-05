<script lang="ts" setup>
    import { useStdoutDimensions } from 'vue-termui';
    const props = defineProps({
        msg: Object,
        borderColor: String,
        submsg: Object
    })
    const [width, height] = useStdoutDimensions()
</script>
<template>
    <Box
    :flexGrow="1"
    display="flex"
    :borderColor="borderColor"
    borderStyle="round"
    paddingLeft="10%" 
    alignItems="center">
        <Text color="yellowBright"> {{ msg.value }} </Text>
    </Box>
</template>
<style>
    
</style>