<script setup lang="ts">
import { dexRoutes } from '@/router/dex';
</script>
  
<template>
    <div class="dex-body">
        <nav class="sub-nav">
            <RouterLink v-for="(item, index) in dexRoutes" :key="index" :to="'/dex/'+ (item.noParamPath || item.path)"
             class="link"> <span class="link-text">{{ item.name }} </span></RouterLink>
        </nav>
        <router-view v-slot="{ Component}">
            <component :is="Component"/>
        </router-view>
    </div>
    <!--div v-for="(specie, index) of gamedata.species" :key="index">
        {{ specie.name }}
    </div-->
</template>
<style scoped>
    .dex-body{
        min-width: 100%;
        width: fit-content;
        height: 100%;
        display: flex;
        flex-direction: column;

    }
    .sub-nav{
        display: flex;
        width: 100%;
        height: 2em;
        font-size: 1.15em;
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