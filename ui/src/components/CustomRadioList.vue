<script lang="ts" setup>
import { randomStr } from '@/utils/random';
    interface Props{
        nameId?: string,
        checked?: string,
        list: string[],
    }
    const props = withDefaults(defineProps<Props>(), {
        nameId: randomStr(5),
        list:  ()=>[]
    })

    const emit = defineEmits<{
        (e: 'change', value: string): void
    }>()

    function onChange(payload: Event){
        const target = payload.target as HTMLInputElement
        emit('change', target.value)
    }


</script>
<template>
    <div class="radio-wrapper" @change="onChange">
        <template v-for="(field, index) in props.list" :key="index">
            <hr v-if="index" class="vertical-bar">
            <label :for="props.nameId + field" class="label-radio">{{ field }}</label>
            <input type="radio" :id="props.nameId + field" :name="props.nameId" :value="field" :checked="field == props.checked">
        </template>
    </div>
</template>
<style scoped>
    .radio-wrapper{
        display: flex
    }
    .vertical-bar{
        border-left: solid 0.1em black;
        padding-right: 0.3em;
        margin-left: 0.3em;
        height: 100%;
    }
    .label-radio{
        margin-right: 0.3em; 
    }
    input{
        vertical-align: middle;
    }
    label{
        cursor: pointer;
    }
</style>