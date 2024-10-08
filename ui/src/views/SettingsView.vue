<script lang="ts" setup>
    import { settingsRoutes } from '@/router/settings';

</script>
<template>
    <div class="parent">
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