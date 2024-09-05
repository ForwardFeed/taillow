<script lang="ts" setup>
    import { useStdoutDimensions } from 'vue-termui';
    import PannelCommands from './PannelCommands.vue';
    import {store } from './store';
    import { UIColors } from './types';
    import { tuiData } from './tui_data';
    import PannelOutput from './PannelOutput.vue';
    import PannelShortcuts from './PannelShortcuts.vue';

    const [width, height] = useStdoutDimensions()
    onKeyData(['ArrowLeft'], ()=>{
        if (store.isSideBarSelected) return
        store.isSideBarSelected = true
    })
    onMouseData(2, (e)=>{
        const x = e.clientX
        const y = e.clientY
        // check only if it's within the sidebar x range
        if (x < (width.value / 5 ) + 4 || x > (width.value - 1)){
            return
        }
        // check if it's not somewhere else in the y axis
        if (y < 3 || y > (height.value - 2)){
            return
        }
        if (store.isSideBarSelected)
            store.isSideBarSelected = false
    });

    const borderColor = computed(()=>{
        return store.isSideBarSelected ? UIColors.UNSELECTED : UIColors.SELECTED
    })

</script>
<template>
    <Box
    width="80%"
    height="100%"
    :borderColor="borderColor"
    borderStyle="round">
        <Text v-if="!store.isSidebarSubMenu"> {{ tuiData.slots[store.sideBarCursor].pannelDesc }}</Text>
        <PannelCommands :commands="tuiData.slots[store.sidebarMainMenuSelection].commands" v-else-if="store.sideBarCursor == 0"
        :cmdDir="tuiData.slots[store.sidebarMainMenuSelection].cmdDir"/>
        <PannelOutput v-else-if="store.sideBarCursor == 1"/>
        <PannelShortcuts v-else-if="store.sideBarCursor == 2" :shortcuts="tuiData.slots[store.sidebarMainMenuSelection].shortcuts"
        :cmdDir="tuiData.slots[store.sidebarMainMenuSelection].cmdDir"/>
    </Box>
</template>
<style>
    
</style>