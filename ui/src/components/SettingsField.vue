<script lang="ts" setup>
import ToolTip from './ToolTip.vue';

interface Props{
    text: string,
    tooltip: string
}
const props = withDefaults(defineProps<Props>(), {
    text: "Please name this setting >:c",
    tooltip: "",
})
    
</script>
<template>
    <div class="row">
        <div class="name">
            <span>{{ props.text }}</span>
        </div>
        <ToolTip v-if="props.tooltip" :text="props.tooltip"/>
        <div class="slot-container">
            <slot></slot>
        </div>

    </div>
</template>
<style scoped>
    .row{
        width: 97%;
        margin: auto;
        border: solid 1px black;
        border-radius: 0.3em;
        display: flex;
        padding: 1em;
    }
    .name{
        position: relative;
        margin-right: 1em;
    }
    .slot-container{
        margin: auto;
    }
</style>