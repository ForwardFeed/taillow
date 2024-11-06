<script lang="ts" setup>
    import { useMouseClickedOutsideNode } from '@/composable/mouse';
    import { ref, watch, type Ref } from 'vue';
    import CustomTextInput from './CustomTextInput.vue';

    interface Props{
        optionsList: string[],
        default: string
    }
    const props = withDefaults(defineProps<Props>(), {
        optionsList: ()=>{return []},
        default: ""
    })
    enum SelectState{
        sleeping,
        active,
    }
    watch(props, (changed)=>{
        selected.value = changed.default
    })
    
    const state = ref(SelectState.sleeping)
    const selected = ref( props.default ? props.optionsList?.[0] : props.default)

    function onClickParent(event: MouseEvent){
        const target = event.target as HTMLInputElement
        const offset = getPositionScrollOffsetted(target)
        console.log(offset, document.body.clientWidth, document.body.clientHeight, target.clientHeight, target.clientWidth)
        if (state.value == SelectState.sleeping){
            state.value = SelectState.active
        }
        // open suggestions smartly
    }
    function onClickSelection(event: MouseEvent){
        event.stopPropagation() // or else the parent will open the box again
        const target = event.target as HTMLInputElement
        selected.value = target.innerText
        state.value = SelectState.sleeping
    }

    function getPositionScrollOffsetted(el: HTMLInputElement) {
        const rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY
        };
    }


    const parent = ref() as Ref<HTMLElement | undefined>
    watch(useMouseClickedOutsideNode(parent), ()=>{
        if (state.value == SelectState.active){
            state.value = SelectState.sleeping
        }
    })
</script>
<template>
    <div class="select-parent" @click="onClickParent" ref="parent">
        <div class="select-history">

        </div>
        <div class="select-list" v-show="state == SelectState.active">
            <div class="select-selection" v-for="(option, index) in props.optionsList" :key="index" @click="onClickSelection">
                {{ option }}
            </div>
        </div>
        <div class="select-selected" v-if="state == SelectState.sleeping">
            {{ selected }}
        </div>
        <CustomTextInput v-else :value="selected" :active="true" />
    </div>
</template>
<style scoped>
    .select-parent{
        position: relative;
        width: 12em;
        max-width: 12em;
        height: 1.5em;
    }
    .select-selected{
        margin: 0;
        padding: 0;
        border: none;
    }
    .select-list{
        width: 100%;
        position: absolute;
        top: -40px;
    }
    .select-selection{
        width: 100%;
        background-color: aquamarine
    }
    .select-selection:hover{
        background-color: aqua;
    }
    
</style>