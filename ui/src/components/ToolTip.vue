<script lang="ts" setup>
import { ref } from 'vue';

    interface Props{
        tip: string,
        text?: string

    }
    const props = withDefaults(defineProps<Props>(), {text: "?"})
    const show = ref(false)
</script>
<template>
    <div class="tooltip" @mouseover="show = true" @mouseleave="show = false" @click="show = !show">
        <div class="active bg2" v-if="show">
            {{ props.tip}}
        </div>
        <div class="passive">
            {{  props.text }}
        </div>
    </div>
</template>
<style scoped>
    .tooltip{
        position: relative;
    }
    .active{
        position: absolute;
        z-index: 1;
        padding: 0.4em;
        border: double 0.2vmax;
        min-width: 9em;
    }
    .passive{
        text-decoration: underline dotted;
        font-size: 0.9em;
    }

</style>