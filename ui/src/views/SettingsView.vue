<script lang="ts" setup>
    import { settingsRoutes } from '@/router/settings';

</script>
<template>
    <div class="settings-body">
        <nav>
            <RouterLink v-for="(item, index) in settingsRoutes" :key="index" :to="'/settings/'+ item.path"
             class="link"> {{ item.name }} </RouterLink>
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
</style>