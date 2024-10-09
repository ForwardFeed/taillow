<script lang="ts" setup>
import FloatingWindow from '@/components/FloatingWindow.vue';
import SettingsField from '@/components/SettingsField.vue';
import { ColorPicker } from 'vue-color-kit'
import 'vue-color-kit/dist/vue-color-kit.css'

function colorChange(x: any){
    console.log(x)
}

</script>
<template>
    <SettingsField  text="bb" tooltip="">
        <input type="text">

    </SettingsField>
    <FloatingWindow>
        <div class="wrapper-for-grabe-me">
            <div class="grab-me">
                grab-me
            </div>
            <ColorPicker :changeColor="colorChange"/>
        </div>
    </FloatingWindow>
    
</template>
<style scoped>
    .wrapper-for-grabe-me{
        display: flex;
        flex-direction: column;
    }
    .grab-me{
        background-color: wheat;
        width: 100%;
        height: 1em;
        text-align: center;
    }
</style>