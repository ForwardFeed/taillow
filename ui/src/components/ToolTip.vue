<script lang="ts" setup>
import { ref } from 'vue';

    interface Props{
        text: string
    }
    const props = withDefaults(defineProps<Props>(), {
        text: "props"
    })
    const show = ref(false)
</script>
<template>
    <div class="tooltip" @mouseover="show = true" @mouseleave="show = false" @click="show = !show">
        <div class="active bg2" v-if="show">
            {{ props.text}}
        </div>
        <div class="passive" v-else>
            ?
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
        padding: 1em;
        border: dotted 0.3em black;
        border-radius: 0.3em;
        min-width: 9em;
    }
    .passive{
        text-decoration: underline dotted;
        font-size: 0.9em;
    }

</style>