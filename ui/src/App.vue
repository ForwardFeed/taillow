<script setup lang="ts">
    import { RouterView } from 'vue-router'
    import BarNav from './components/BarNav.vue';
    import GlobalFooter from './components/GlobalFooter.vue';
    import GlobalErrors from './components/GlobalErrors.vue';
    import { useVersionStore } from './stores/versions';

    const storeVersion = useVersionStore()
    storeVersion.fetch()
</script>

<template>
    <GlobalErrors/>
    <BarNav/>
    <main>
        <router-view v-slot="{ Component, route }">
            <keep-alive>
                <component v-if="route.meta.keepAlive" :is="Component"/>
            </keep-alive>
            <component  v-if="!route.meta.keepAlive" :is="Component"/>
        </router-view>
    </main>
    <GlobalFooter/>
</template>

<style>
:root {
    --bg1:  #b42828;
    --c1:   "red";
}

main{
    overflow: scroll;
    flex-grow: 1;
}
</style>