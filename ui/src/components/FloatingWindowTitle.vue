<script lang="ts" setup>
import CrossIcon from './icons/CrossIcon.vue';

    interface Props{
        text: string
    }
    const props = withDefaults(defineProps<Props>(), {
        text:  "defaultVal"
    })

    const emits = defineEmits<{
        (e: "closed"): void
    }>()
</script>
<template>
    <div class="title-container bg3">
        <div class="title-name">
            <span>{{ props.text }}</span>   
        </div>
        <div class="cross-wrapper">
            <CrossIcon size="1.3em" @click="emits('closed')"></CrossIcon>
        </div>
    </div>
</template>
<style scoped>
    .title-container{
        position: relative;
        height: 1.3em;
    }
    .title-name{
        width: 100%;
        display: flex;
    }
    span{
        cursor:grab;
        margin: auto;
        user-select: none;
    }
    .cross-wrapper{
        position: absolute;
        right: 0;
        top: 0;
    }
</style>