<script lang="ts" setup>
    import { RouterLink } from 'vue-router'
    import BurgerIcon from './icons/BurgerIcon.vue';
    import { ref, watch } from 'vue';
    import { useScrollGlobalRaw } from '@/composable/scroll';

    const showTopBar = ref(true)
    watch(useScrollGlobalRaw(), (val)=>{
        showTopBar.value = topBar.value.clientHeight > val ? true : !val
       
    })
    const topBar = ref()
</script>
<template>
    <nav v-show="showTopBar" ref="topBar">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/dex">Dex</RouterLink>
        <RouterLink to="/calc">Calc</RouterLink>
        <RouterLink to="/builder">Builder</RouterLink>
        <RouterLink to="/settings">Settings</RouterLink>
    </nav>
    <BurgerIcon v-show="!showTopBar"/>
    
</template>
<style scoped>
    nav{
        display: flex;
        
    }
    nav > *{
        margin: auto;
    }
    .burgericon-container{
        position: relative;
    }
</style>