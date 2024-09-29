<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import BarNav from './components/BarNav.vue';
  import GlobalFooter from './components/GlobalFooter.vue';
  import AppLoading from './components/AppLoading.vue';
  import { AppState, useAppstateStore } from './stores/appstate';

  const appStore = useAppstateStore()
  
  
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
    <Suspense>
      <GlobalFooter/>
    </Suspense>
  </template>
   
</template>