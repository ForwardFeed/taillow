<script lang="ts" setup generic="DataTarget, ReorderFields extends string">
import type { ReorderMap } from '@/data/search/search';
import { ref, type Ref } from 'vue';

type Props = {
    reorderFields:readonly  ReorderFields[],
    data: DataTarget[],
    reorderMap: ReorderMap<ReorderFields, DataTarget>
}
const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits<{
    (e: "update", indexes: number[]): void
}>()
const NO_ORDER_ARROW = "→"
const A_Z_ORDER_ARROW = "↓"
const Z_A_ORDER_ARROW = "↑"
type ArrowOfOrder = typeof NO_ORDER_ARROW | typeof A_Z_ORDER_ARROW | typeof Z_A_ORDER_ARROW
const reorderStatus: {status: Ref<ArrowOfOrder>, field: ReorderFields}[] =
    props.reorderFields.map(x => {return {
        status: ref(NO_ORDER_ARROW),
        field: x
    }
})

/* 
* I don't support reordering on waterfall
*/
function resetAllOtherArrowDirection(){
    reorderStatus.forEach(function(val){
        val.status.value = NO_ORDER_ARROW
    })
}

function changeReorder(fieldIndex: number){
    const status = reorderStatus[fieldIndex]
    const func = props.reorderMap[status.field]
    if (!func)
        return
    let currStatus: ArrowOfOrder
    if (status.status.value === NO_ORDER_ARROW){
        emits("update", func(props.data))
        resetAllOtherArrowDirection()
        currStatus = A_Z_ORDER_ARROW
    } else if (status.status.value === A_Z_ORDER_ARROW){
        emits("update", func(props.data).reverse()) 
        resetAllOtherArrowDirection()
        currStatus = Z_A_ORDER_ARROW
    }
    else {
        emits("update", [...Array(props.data.length).keys()]) 
        currStatus = NO_ORDER_ARROW
    }
    status.status.value = currStatus
}

</script>
<template>
<div class="reorder-bar">
    <div> Interact to reorder </div>
    <div v-for="field, index in props.reorderFields" :key="index" class="reorder-button">
        <div v-if="props.reorderMap[field]" @click="changeReorder(index)">
            {{ field }} {{ reorderStatus[index].status }}
        </div>
    </div>
</div>
</template>
<style scoped>
.reorder-bar{
    display: flex;
}
.reorder-button{
    margin: auto
}
</style>