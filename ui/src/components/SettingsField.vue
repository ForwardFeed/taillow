<script lang="ts" setup>
import ToolTip from './ToolTip.vue';

interface Props{
    text: string,
}
const props = withDefaults(defineProps<Props>(), {
    text: "Please name this setting >:c",
    enu: "select"
})
    
</script>
<template>
    <div class="row">
        <div class="name">
            <span>{{ props.text }}</span>
            <ToolTip/>
        </div>
        <slot></slot>
    </div>
</template>
<style scoped>
    .row{
        margin: auto;
        border: solid 2px black;
        display: flex;
    }
    .name{
        position: relative;
    }
</style>