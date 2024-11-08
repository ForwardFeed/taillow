<script lang="ts" setup generic="DataTarget, ReorderFields extends string">
import type { ReorderMap } from '@/data/search/search';
import { ref, type Ref } from 'vue';

export type FullField<ReorderFields> = {
    field: string | ReorderFields,
    str?: string,
    width: string,
}

type Props = {
    reorderFields:readonly  ReorderFields[],
    data: DataTarget[],
    reorderMap: ReorderMap<ReorderFields, DataTarget>
    fullFields?: FullField<ReorderFields>[],
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
<div class="reorder-bar"  v-if="!props.fullFields">
    <div> Interact to reorder </div>
    <div v-for="field, index in props.reorderFields" :key="index" class="reorder-button">
        <div @click="changeReorder(index)">
            {{ field }} {{ reorderStatus[index].status }}
        </div>
    </div>
</div>
<div class="reorder-bar"  v-else>
    <div v-for="field, index in props.fullFields" :key="index" class="reorder-button-reordered" :style="`width: ${field.width};`">
        <template v-if="~props.reorderFields.indexOf(field.field as ReorderFields)">
            <span @click="changeReorder(props.reorderFields.indexOf(field.field  as ReorderFields))">
                {{ field.str ? field.str : field.field }} {{ reorderStatus[props.reorderFields.indexOf(field.field  as ReorderFields)].status }}
            </span>
        </template>
        <template v-else>
            <span>
                {{ field.str ? field.str : field.field }}
            </span>
        </template>
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
.reorder-button-reordered{
    display: flex;
}
</style>