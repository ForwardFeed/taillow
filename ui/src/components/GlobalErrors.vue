<script lang="ts" setup>
    import { useErrorStore } from '@/stores/errors';
    import { ref } from 'vue';
import WarningIcon from './icons/WarningIcon.vue';
    const open = ref(false)
    function openModal(){open.value = true}
    function closeModal(){open.value = false}
    const errors = useErrorStore()
</script>
<template>
    <div class="modal-container">
        <div class="main-modal" v-if="open">
        <div class="top-bar">
            <button @click="closeModal">
                close
            </button>
        </div>
        <div class="content">

        </div>
    </div>
    </div>
  
    <Teleport to="body">
        <WarningIcon v-if="errors.globalErrors.notifications" @click="openModal" :count="errors.globalErrors.notifications"/>
    </Teleport>

</template>
<style scoped>
    .modal-container{
        z-index: 1;
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .main-modal{
        position: sticky;
        top: 10vh;
        left: 10vw;
        height: 80vh;
        width: 80vw;
        display: flex;
        flex-direction: column
    }
    .top-bar{
        height: 3em;
        width: 100%;
    }
    .content{
        flex-grow: 1;
    }
    .notification{
        position: sticky;
        bottom: 5vh;
        right: 5vw;
    }
</style>