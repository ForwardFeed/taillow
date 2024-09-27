<script setup lang="ts">
  import { RouterView } from 'vue-router'
import BarNav from './components/BarNav.vue';
</script>

<template>
    <BarNav/>
  <main>
    <RouterView />
  </main>
</template>