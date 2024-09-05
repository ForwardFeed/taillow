<script lang="ts" setup>
    import { useStdoutDimensions } from "vue-termui";
    import { Shortcut } from "./tui_data"
    import { store } from "./store";
    import path from "node:path";
    import { UIColors } from "./types";
    import { CommandAnim } from "./run_command";

    const props = defineProps({
        shortcuts: {
            type: Array<Shortcut>,
            required: true
        },
        cmdDir: {
            type: String,
            required: true
        }
    })
    const borders   = new Array(props.shortcuts.length).fill(undefined).map(_u => ref(UIColors.UNSELECTED))
    const texts     = new Array(props.shortcuts.length).fill(undefined).map((_u, i) => ref(props.shortcuts[i].text))
    const statuses  = new Array(props.shortcuts.length).fill(undefined).map((_u, i) => 0)
    
    let shouldStop = false
    let cycleLeft = 4
    let intervalStopDoesNotWorkXD = store.cmd.isActive()
    useInterval(()=>{
        if (!intervalStopDoesNotWorkXD)
            return
        if (!store.cmd.isActive())
            shouldStop = true

        if (shouldStop)
            cycleLeft--

        const index     = store.shortcut
        const textRef   = texts[index]
        const borderRef = borders[index]

        if (!cycleLeft){
            intervalStopDoesNotWorkXD = false
            borderRef.value = UIColors.UNSELECTED
            textRef.value = props.shortcuts[index].text
        } else {
            const statusesAnim = [
                ()=>{
                    textRef.value = "Running"
                    borderRef.value = UIColors.RUNNING
                },
                ()=>{
                    textRef.value = "Running."
                    borderRef.value = UIColors.RUNNING2
                },
                ()=>{
                    textRef.value = "Running.."
                    borderRef.value = UIColors.RUNNING3
                },
                ()=>{
                    textRef.value = "Running..."
                    borderRef.value = UIColors.RUNNING4
                },
            ]
            statusesAnim[statuses[index]]()
            statuses[index] = (statuses[index] + 1) % (statusesAnim.length - 1)
        }
    
    }, 200);
    
    function launchCommand(index: number){
        const command = `npm run ${props.shortcuts[index].cmd}`
        store.cmd.run({
            cmd: command,
            cwd: path.join(__dirname, props.cmdDir),
        })
        store.shortcut = index
        cycleLeft = 4  
        intervalStopDoesNotWorkXD = true
    }
    const [width, height] = useStdoutDimensions()
    onMouseData(2, (e)=>{
        const x = e.clientX
        const y = e.clientY
        // I only have activable element in this range
        if (y > (height.value - 5) || y < 4){
            return
        }
        // check if its within the main pannel
        if (x < (width.value / 5 ) + 4 || x > (width.value - 4)){
            return
        }
        const offset = (width.value / 5 ) + 4 
        const xbox = (x - offset) / (width.value - 4 - offset)
        let shortcut = (xbox) / (1 / props.shortcuts.length)
        shortcut = Math.floor(Math.min(props.shortcuts.length - 1, shortcut))
        launchCommand(shortcut)
    });
</script>
<template>
    <Box flexGrow="1">
        <Box v-for="(shortcut, index) in shortcuts"
        flexGrow="1"
        :borderColor="borders[index].value"
        borderStyle="round">
            <Box
                margin="auto">
                <Text margin="auto"> 
                {{ texts[index]  }}
                </Text>
            </Box>
            
        </Box>
    </Box>
</template>
<style>
    
</style>