<script lang="ts" setup>
import SideBar from './SideBar.vue';
import MainPannel from './MainPannel.vue';
import { useStdoutDimensions } from 'vue-termui';
import { UIColors } from './types';
import { store, initStore} from './store';
import { tuiData } from './tui_data';

const [width, height] = useStdoutDimensions()
initStore()
const getTitle = computed(()=>{
  return `${tuiData.baseTitle} ${store.isSidebarSubMenu ? 
        tuiData.slots[store.sidebarMainMenuSelection].mainMenuText :
        "Main Menu"}`
})
</script>

<template>
  <Box
    :margin="2"
    width="calc(100% - 2)"
    :height="height - 2"
    flexDirection="column"
    :borderColor=UIColors.NON_SELECTABLE
    borderStyle="round">
  >
    <Box
    :height="1"
    margin="auto">
        <Text> {{ getTitle }} {{ store.debug }}</Text>
    </Box>
    <Box flexDirection="row"
    flexGrow="1"
    height="calc(100% - 1)">
      <SideBar/>
      <MainPannel/>
    </Box>
  </Box>
</template>
