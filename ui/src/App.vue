<script setup lang="ts">
import { RouterView } from 'vue-router'
import BarNav from './components/BarNav.vue';
import GlobalErrors from './components/GlobalErrors.vue';
import { useVersionStore } from './stores/versions';
import { useSettingsStore } from './stores/settings';
import { watch } from 'vue';
import { changeGlobalCssVariables } from './data/settings/settings_theme';

const storeVersion = useVersionStore()
// when something with ?v=XxXx matches, It means that a version is being given to the user
// Through a shared link, so people don't get confused too much about why they don't have the right version
// There's a bug with vue router so i'm doing that without it in vanilla JS
const forceVersion = new URLSearchParams(window.location.search).get("v")

if (forceVersion && typeof forceVersion === "string"){
    storeVersion.fetch(forceVersion)
}else{
    storeVersion.fetch()
}


const theme = useSettingsStore().theme.current
watch(theme, ()=>{
    changeGlobalCssVariables(theme)
})
changeGlobalCssVariables(theme)
</script>

<template>
    <GlobalErrors/>
    <BarNav/>
    <main>
        <router-view v-slot="{ Component, route}">
            <!-- Ugly solution but bring me something that works beside this-->
            <keep-alive>
                <component v-if="route.meta.keepAlive === 1" :is="Component"/>
            </keep-alive>
            <keep-alive>
                <component v-if="route.meta.keepAlive === 2" :is="Component"/>
            </keep-alive>
            <keep-alive>
                <component v-if="route.meta.keepAlive === 3" :is="Component"/>
            </keep-alive>
            <component  v-if="!route.meta.keepAlive" :is="Component"/>
        </router-view>
    </main>
</template>

<style>


main{
    overflow: scroll;
    flex-grow: 1;
    display: inline-flex;
}
</style>