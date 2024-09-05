<script lang="ts" setup>
    import { Ref, useStdoutDimensions } from 'vue-termui';
    import SideBarBox from './SideBarBox.vue';
    import {store } from './store';
    import { Ran, UIColors} from './types';
    import { tuiData } from './tui_data';
    const NB_BOXES = tuiData.slots.length
    
    function selectCursor(){
        if (!store.isSidebarSubMenu){
            tuiData.slots[store.sideBarCursor].mainMenuSelect()
        } else {
            tuiData.slots[store.sideBarCursor].subMenuSelect()
        }
        
    }
    onKeyData(['-', 'ArrowDown'], () => {
        if (!store.isSideBarSelected) return
        store.sideBarCursor = (store.sideBarCursor + 1) % NB_BOXES as Ran<4>
    })
    onKeyData(['+', 'ArrowUp'], () => {
        if (!store.isSideBarSelected) return
        store.sideBarCursor = store.sideBarCursor ? store.sideBarCursor - 1 as Ran<4> : (NB_BOXES - 1) as Ran<4>
    })
    onKeyData(['Enter', ' '], ()=>{
        if (!store.isSideBarSelected) return
        selectCursor()
    })
    onKeyData(['ArrowRight'], ()=>{
        if (!store.isSideBarSelected) return
        store.isSideBarSelected = false
    })
    const [width, height] = useStdoutDimensions()
    // the one that deals with clicks
    onMouseData(2, (e)=>{
        const x = e.clientX
        const y = e.clientY
        // check only if it's within the sidebar x range
        if (x < 4 || x > ((width.value / 5) + 4)){
            return
        }
        // check if it's not somewhere else in the y axis
        if (y < 3 || y > (height.value - 2)){
            return
        }
        // sidebar has now the focus again
        if (!store.isSideBarSelected)
            store.isSideBarSelected = true
        
            const ybox = Math.floor( y  /  (height.value / NB_BOXES ))
        if (ybox > (NB_BOXES - 1) || ybox < 0)
            return
        if (store.sideBarCursor == ybox){
            selectCursor()
            return
        }
        store.sideBarCursor = ybox as Ran<4>
    })
    function getTorderColor(index: number){
        return (store.isSideBarSelected && store.sideBarCursor == index)? UIColors.SELECTED : UIColors.UNSELECTED
    }
</script>
<template>
    <Box class="sidebox" 
    flexDirection="col"
    width="20%"
    height="100%">
        <template v-for="(data, index) in tuiData.slots">
            <SideBarBox :msg="data.text"
        :borderColor="getTorderColor(index)"/>
        </template>
    </Box>
</template>
<style>
</style>