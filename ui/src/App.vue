<script setup lang="ts">
  import { RouterView } from 'vue-router'
import BarNav from './components/BarNav.vue';
</script>

<template>
    <BarNav/>
  <main>
    <router-view v-slot="{ Component, route }">
      <keep-alive>
          <component v-if="route.meta.keepAlive" :is="Component"/>
      </keep-alive>
      <component  v-if="!route.meta.keepAlive" :is="Component"/>
    </router-view>
  </main>
</template>