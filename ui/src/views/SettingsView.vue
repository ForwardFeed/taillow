<script lang="ts" setup>
    
</script>
<template>
    <div class="parent">
        <nav>
            <RouterLink to="/settings/general" class="link"> General </RouterLink>
            <RouterLink to="/settings/dex" class="link"> Dex</RouterLink>
        </nav>
        <router-view v-slot="{ Component}">
            <component :is="Component"/>
        </router-view>
    </div>
</template>
<style scoped>
    .parent{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    nav{
        display: flex;
        width: 100%;
        height: 3em;
    }
    .link {
        margin: auto;
    }
    .content{
        flex-grow: 1;
    }
</style>