<script setup lang="ts">
import { RouterView } from 'vue-router'
import BarNav from './components/BarNav.vue';
import GlobalFooter from './components/GlobalFooter.vue';
import GlobalErrors from './components/GlobalErrors.vue';
import { useVersionStore } from './stores/versions';
import { useSettingsStore } from './stores/settings';
import { watch } from 'vue';
import { changeGlobalCssVariables } from './data/settings/settings_theme';

const storeVersion = useVersionStore()
storeVersion.fetch()
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
    <GlobalFooter/>
</template>

<style>


main{
    overflow: scroll;
    flex-grow: 1;
}
</style>