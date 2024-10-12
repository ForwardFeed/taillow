<script lang="ts" setup>
import ToolTip from './ToolTip.vue';

interface Props{
    text: string,
    tooltip?: string
}
const props = withDefaults(defineProps<Props>(), {
    text: "Please name this setting >:c",
    tooltip: "",
})
    
</script>
<template>
    <div class="row">
        <div class="description">
            <span>{{ props.text }}</span>
            <ToolTip v-if="props.tooltip" :text="props.tooltip"/>
        </div>
        
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
        font-size: 0.85em;
        margin-bottom: 2px;
    }
    .description{
        position: relative;
        display: flex;
        margin-right: 1em;
        width: 50%;
        max-width: 50%
    }
    .description span{
        margin-right: 1em;
    }
    .slot-container{
        height: fit-content;
        margin: auto;
        display: flex;
    }
</style>