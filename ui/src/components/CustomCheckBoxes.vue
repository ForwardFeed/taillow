<script lang="ts" setup>
import { randomStr } from '@/utils/random';
import { ref, watch } from 'vue';

    interface Props{
        nameId?: string,
        checked?: string[],
        list: string[]
    }
    const props = withDefaults(defineProps<Props>(), {
        nameId: randomStr(5),
        checked: ()=>[] as string[],
        list: ()=>[] as string[]
    })

    const emit = defineEmits<{
        (e: 'change', values: string[]): void
    }>()

    function onChange(){
        emit('change', listChecked.value)
    }
    // This is because I cannot pass ref as props nor using inject nicely
    // So instead of having a simple lifter I have to relay between two ref in a stupid manner
    // Oh and before you ask, I can't just ignore the v-model for the input binding
    // because I cannot ask vue NOT to put checked in a condition and put checked in because OF COURSE
    // web browsers if your checked is checked="false" or checked="antidisestablishmentarianism"
    // as long checked exist it ruins you day buy being checked
    // Edit: vue3 ommit the attribute if it's null or undefined
    watch(()=>props.checked, function(){
        listChecked.value = props.checked
    })
    const listChecked = ref([]as string[])
</script>
<template>
    <div class="checkbox-wrapper" @change="onChange" >
        <template v-for="(field, index) in props.list" :key="index">
            <hr v-if="index" class="vertical-bar">
            <label :for="props.nameId + field" class="label-checkbox">{{ field }}</label>
            <input type="checkbox" :id="props.nameId + field" :name="props.nameId" :value="field" v-model="listChecked"/>
        </template>
    </div>
</template>
<style scoped>
    .checkbox-wrapper{
        display: flex
    }
    .vertical-bar{
        border-left: solid 0.1em black;
        padding-right: 0.3em;
        margin-left: 0.3em;
        height: 100%;
    }
    .label-checkbox{
        margin-right: 0.3em; 
    }
    input{
        vertical-align: middle;
    }
    label{
        cursor: pointer;
    }
</style>