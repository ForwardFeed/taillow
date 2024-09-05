<script lang="ts" setup>

    import { store } from './store';
    import { useStdoutDimensions } from 'vue-termui';
    
    const [width, height] = useStdoutDimensions()
    // this actually gets computed at max twice
    // don't ask me how or why, it just is what it is
    const outputTransformed = computed(()=>{
        const w = Math.floor(width.value * 0.80) - 3
        const h = height.value - 7
        const finalLines: Array<String> = []
        const lines = store.cmd.out.split("\n")
        const linesLen = lines.length
        for (let i = 0; i < linesLen; i++){
            const split = lines[i]
            if (split.length > w){
                const splitted = split.match(RegExp(`.{0,${w}}`, "g"))
                if (splitted == null){
                    continue;
                }
                splitted.splice(splitted.length - 1, 1)
                finalLines.push(...splitted)
            } else {
                finalLines.push(split)
            }
        }
        let rangeBottom = finalLines.length - 1 - h + scroll.n
        if (rangeBottom < 0){
            scroll.n += 1
            rangeBottom = 1
        }
        let rangeTop = rangeBottom + h
        if (rangeTop > finalLines.length - 1){
            rangeTop = finalLines.length - 1
            scroll.n -= 1
        }
        return finalLines.slice(rangeBottom, rangeTop).join('\n')
    })
    let scroll = reactive({
        n: 0,
    })
    // the one that deals with scroll
    onMouseData(-1, (e)=>{
        // weirdest hack but hey, that works to filter only what's a scroll
        // @ts-ignore: whatever that is
        if (e.input[4] != "4" && e.input[4] != "5" ){
            return
        }
        if (e.button){
            scroll.n++
        } else {
            scroll.n--
        }
    })
</script>
<template>
     <Box
            borderColor=""
            borderStyle=""
            height="100%"
            width="100%">
                <Text> {{ outputTransformed }}</Text>
            </Box>
</template>
