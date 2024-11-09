<script lang="ts" setup>
    import { settingsRoutes } from '@/router/settings';

</script>
<template>
    <div class="settings-body bg1">
        <nav>
            <RouterLink v-for="(item, index) in settingsRoutes" :key="index" :to="'/settings/'+ item.path"
             class="link"> <span class="link-text">{{ item.name }} </span></RouterLink>
        </nav>
        <router-view v-slot="{ Component}">
            <component :is="Component"/>
        </router-view>
    </div>
</template>
<style scoped>
    .settings-body{
        min-width: 100%;
        width: fit-content;
        display: flex;
        flex-direction: column;

    }
    nav{
        display: flex;
        width: 100%;
        height: 3em;
    }
    .link{
        text-align: center;
        margin: auto;
        flex-grow: 1;
        height: 100%;
        display: flex;
        background-color: var(--sub-nav-P);
    }
    .link-text{
        margin: auto;
    }
    .link:hover{
        background-color: var(--sub-nav-H);
    }
    .router-link-active{
        background-color: var(--sub-nav-A);
    }
</style>