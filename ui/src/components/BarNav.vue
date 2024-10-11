<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import BurgerIcon from './icons/BurgerIcon.vue';
import { ref, watch } from 'vue';
import { useScrollGlobalRaw } from '@/composable/scroll';

const showTopBar = ref(true)
const topBar = ref()
watch(useScrollGlobalRaw(), (val)=>{
    showTopBar.value = topBar.value.clientHeight > val ? true : !val
    
})


</script>
<template>
    <nav v-show="showTopBar" ref="topBar">
        <RouterLink class="link" to="/"><span class="link-text">Home</span></RouterLink>
        <RouterLink class="link" to="/dex"><span class="link-text">Dex</span></RouterLink>
        <RouterLink class="link" to="/calc"><span class="link-text">Builder</span></RouterLink>
        <RouterLink class="link" to="/builder"><span class="link-text">Calc</span></RouterLink>
        <RouterLink class="link" to="/settings"><span class="link-text">Settings</span></RouterLink>
    </nav>
    <BurgerIcon v-show="!showTopBar"/>
    
</template>
<style scoped>
    nav{
        display: flex;
        height: 3em;
        font-size: 1.15em;
    }
    .link{
        text-align: center;
        margin: auto;
        flex-grow: 1;
        height: 100%;
        display: flex;
        background-color: var(--main-button-P);
    }
    .link:hover{
        background-color: var(--main-button-H);
    }
    .link-text{
        margin: auto;
    }
    .burgericon-container{
        position: relative;
    }
    .router-link-active{
        background-color: var(--main-button-A);
    }
</style>