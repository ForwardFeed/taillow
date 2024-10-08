<script lang="ts" setup>
    import { useErrorStore } from '@/stores/errors';
    import { ref } from 'vue';
import WarningIcon from './icons/WarningIcon.vue';
    const open = ref(false)
    function openModal(){
        open.value = true
        errors.setAsRead()
    }
    function closeModal(){open.value = false}
    function clickOnModalOuter(payload: MouseEvent){
        const target = payload.target as HTMLElement
        if (target.className == "modal-container")
            open.value = false
    }
    const errors = useErrorStore()

</script>
<template>
    <div class="modal-container" v-if="open" @click="clickOnModalOuter">
        <div class="main-modal">
        <div class="top-bar">
            <button class="right-btn" @click="closeModal">
                close
            </button>
        </div>
        <div class="content">
            <div class="error-div" v-for="(item) of errors.list" :key="item">
                {{ item }}
            </div>
            
        </div>
    </div>
    </div>
  
    <Teleport to="body">
        <WarningIcon v-if="errors.notifications" @click="openModal" :count="errors.notifications"/>
    </Teleport>

</template>
<style scoped>
    .notification{
        position: sticky;
        bottom: 5vh;
        right: 5vw;
    }
    .modal-container{
        background-color: black;
        background-color: rgba(0,0,255,0.5);
        z-index: 1;
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .main-modal{
        background-color: white;
        position: sticky;
        top: 10vh;
        left: 10vw;
        height: 80vh;
        width: 80vw;
        display: flex;
        flex-direction: column;
        border-radius: calc(1px + 0.3vmax);
    }
    .top-bar{
        height: 3em;
        width: 100%;
        position: relative
    }
    .right-btn{
        position: absolute;
        top: 0;
        right: 0;
    }
    .content{
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }

    .error-div{
        width: 100%;
    }
</style>