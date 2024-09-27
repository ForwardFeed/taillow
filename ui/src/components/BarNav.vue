<script lang="ts" setup>
    import { RouterLink } from 'vue-router'
    import BurgerIcon from './icons/BurgerIcon.vue';
    import { ref } from 'vue';
    const showTopBar = ref(true)
</script>
<template>
    <nav v-show="showTopBar">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/dex">Dex</RouterLink>
        <RouterLink to="/calc">Calc</RouterLink>
        <RouterLink to="/builder">Builder</RouterLink>
    </nav>
    <BurgerIcon v-show="!showTopBar"/>
</template>
<style>
    
</style>