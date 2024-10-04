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
        <RouterLink class="link" to="/">Home</RouterLink>
        <RouterLink class="link" to="/dex">Dex</RouterLink>
        <RouterLink class="link" to="/calc">Calc</RouterLink>
        <RouterLink class="link" to="/builder">Builder</RouterLink>
        <RouterLink class="link" to="/settings">Settings</RouterLink>
    </nav>
    <BurgerIcon v-show="!showTopBar"/>
    
</template>
<style scoped>
    nav{
        display: flex;
        
    }
    .link{
        margin: auto;
    }
    .burgericon-container{
        position: relative;
    }
</style>