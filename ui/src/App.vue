<script setup lang="ts">
    import { RouterView } from 'vue-router'
    import BarNav from './components/BarNav.vue';
    import GlobalFooter from './components/GlobalFooter.vue';
    import AppLoading from './components/AppLoading.vue';
    import { AppState, useAppstateStore } from './stores/appstate';

    const appStore = useAppstateStore()
    
    const test = "blue"
</script>

<template>
    <template v-if="appStore.state == AppState.loading">
        <AppLoading ref="state"/>
    </template>
    <template v-else-if="appStore.state == AppState.ok">
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
    
</template>

<style>
:root {
    --bg1:  #b42828;
    --c1:   "red";
}

</style>