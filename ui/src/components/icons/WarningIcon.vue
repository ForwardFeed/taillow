<script lang="ts" setup>
    interface Props{
        count: number
    }
    const props = withDefaults(defineProps<Props>(), {
        count: 0
    })
</script>
<template>
    <div class="container">
        <span>{{ props.count }}</span>
        <img alt="Menu Logo"  src="../../assets/warning.svg" @click="$emit('click')"/>
    </div>
   
</template>
<style scoped>
    .container{
        position: absolute;
        width: 3em;
        height: 3em;
        bottom: 0;
    }
    img{
        width: 100%;
        height: 100%
    }
    span{
        position: absolute;
        bottom: 0;
        right: 0;
    }
</style>