<script lang="ts" setup>
    import {store } from './store';
    import { useStdoutDimensions } from 'vue-termui';
    import path from 'node:path';

    const props = defineProps({
        commands: {
            type: Array<String>,
            required: true
        },
        cmdDir: {
            type: String,
            required: true
        },
    })
    const [width, height] = useStdoutDimensions()
    const shortcutComputed = computed(()=>{
        const w = Math.floor(width.value * (0.80* 0.80)) - 3
        const h = Math.floor((height.value - 7)* 0.75)
        const finalLines: Array<String> = []
        const lines = store.cmd.shortOut.split("\n")
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
        // in this file there is a visual glitch if you scroll too much
        // again, please don't ask me how nor why
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
    onMouseData(2, (e)=>{
        const x = e.clientX
        const y = e.clientY
        // I only have activable element in this range
        if (y < (height.value - 5) || y > (height.value - 2)){
            return
        }
        // check if I clicked on enter
        if (x > (width.value * 0.87 ) && x < (width.value * 0.95)){
            launchCommand()
            return
        }
        // check if I clicked on infos
        if (x > (width.value * 0.26 ) && x < (width.value * 0.32)){
            // change tab to infos
            store.sideBarCursor = 1
            return
        }
        if (store.isSideBarSelected){
            store.isSideBarSelected = false
            return
        }
    });
    // execute a command in a sub shell
    function launchCommand(){
        const command = `npm run ${textInput.value}` 
        store.shortcut = 0
        store.cmd.run({
            cmd: command,
            cwd: path.join(__dirname, props.cmdDir)
        })
        textInput.value = ""
        return
    }
    const textInput = ref("")
    let scrollCursor = 0
    onKeyData((e) => {
        if (e.ctrlKey) return
        if (e.metaKey) return
        const k = e.key
        if (k == "Backspace"){
            textInput.value = textInput.value.substring(0, textInput.value .length - 1);
        } else if (k == "Delete"){
            textInput.value = ""
        } else if (k == "Enter"){
           launchCommand()
        } else if ( k == "ArrowUp"){
            scrollCursor = scrollCursor ? scrollCursor - 1 : props.commands.length - 1
            textInput.value = props.commands[scrollCursor]
        } else if ( k == "ArrowDown"){
            scrollCursor = (scrollCursor + 1) % props.commands.length
            textInput.value = props.commands[scrollCursor]
        } else if (k == "ArrowRight" || k == "ArrowLeft"){
            // make some shortcuts
        } else if ( k == "Tab"){
            if (!props.commands) return
            for (let i = 0; i < props.commands.length; i++){
                const text = props.commands[i]
                if (text.match(textInput.value)){
                    textInput.value = text
                    break
                }
            }
        } else if (k == "Escape"){
            store.isSideBarSelected = true
        } else {
            textInput.value += e.input
        }
    })
    const textInputAnilm = ref(true)
    useInterval(() => {
        textInputAnilm.value = !textInputAnilm.value
    }, 600)
</script>
<template>
    <Box 
    width="100%"
    flexDirection="col">
        <Box
        width="100%"
        flexGrow="1">
            <Box borderColor="yellow"
            borderStyle="round"
            witdth="30%"
            flexDirection="col">
                <Box v-for="(command, index) in commands"
                borderColor="green"
                borderStyle=""
                flexGrow="0.25"
                alignItems="center"
                paddingLeft="10%">
                    <Text color="yellowBright"> {{ command }}</Text>
                </Box>
            </Box>
            <Box
            flexGrow="1"
            borderColor="blue"
            borderStyle="round">
                <Text> {{ shortcutComputed }}</Text>
            </Box>
        </Box>
        <Box>
            <Box 
            borderColor="white"
            borderStyle="round"
            :height="3"
            width="10%"
            margin="auto"
            marginRight="0">
                <Text> Infos </Text>
            </Box>
            <Box
            borderColor="white"
            borderStyle="round"
            :height="3"
            width="70%"
            margin="auto"
            marginRight="0"
            marginLeft="0">
                <Text> {{ textInput }}{{ (textInputAnilm && !store.isSideBarSelected)? "|": ""}}</Text>
            </Box>
            <Box 
            borderColor="white"
            borderStyle="round"
            :height="3"
            width="10%"
            margin="auto"
            marginLeft="0">
                <Text> Enter </Text>
            </Box>
        </Box>
        
    </Box>
</template>
<style>
   
</style>