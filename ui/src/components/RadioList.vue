<script lang="ts" setup>
import { randomStr } from '@/utils/random';
    interface Props{
        nameID?: string,
        checked: string,
        list: string[]
    }
    const props = withDefaults(defineProps<Props>(), {
        nameID: randomStr(5),
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
        <template v-for="field of props.list" :key="field">
            <input type="radio" :id="props.nameID + field" :name="props.nameID" :value="field" :checked="field == props.checked">
            <label :for="props.nameID + field">{{ field }}</label>
        </template>
    </div>
</template>
<style scoped>
    .radio-wrapper{
        display: flex
    }
</style>