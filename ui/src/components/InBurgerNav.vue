

<script lang="ts" setup>
    import { RouterLink } from 'vue-router'
</script>
<template>
    <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/dex">Dex</RouterLink>
        <RouterLink to="/calc">Calc</RouterLink>
        <RouterLink to="/builder">Builder</RouterLink>
      </nav>
</template>
<style scoped>
    nav{
        display: flex;
        flex-direction: column;
    }
</style>