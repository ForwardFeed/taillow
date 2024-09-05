import { store } from "./store";

 // the one that deals with clicks
onMouseData(2, (e)=>{
    
})

// the one that deals with scroll
onMouseData(-1, (e)=>{
    if (!store.isSideBarSelected)
        return
    // weirdest hack but hey, that works to filter only what's a scroll
    // @ts-ignore: whatever that is
    if (e.input[4] != "4" && e.input[4] != "5" ){
        return
    }
})

onMounted(()=>{})
onUnmounted(()=>{})