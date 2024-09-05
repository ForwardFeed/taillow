import { Ref } from "vue"
import { store } from "./store"
import chalk from "chalk"
import terminate from "terminate"

export type Shortcut = {
    text: String,
    cmd: String,
}

type SlotSidebar = {
    text: Ref<String>
    pannelDesc: String
    mainMenuText: String
    mainMenuSelect: ()=>void
    subMenuText: String
    subMenuSelect: ()=>void
    commands: String[]
    cmdDir: String,
    shortcuts: Array<Shortcut>
}

type TuiData = {
    baseTitle: String,
    slots: Array<SlotSidebar>
}

function selectSubMenu(){
    store.sidebarMainMenuSelection = store.sideBarCursor
    store.isSidebarSubMenu = true
    const NB_BOXES = tuiData.slots.length
    for (let i = 0; i < NB_BOXES; i++){
        tuiData.slots[i].text.value = tuiData.slots[i].subMenuText
    }
    store.sideBarCursor = 0
}

export const tuiData: TuiData = {
    baseTitle: "Taillow -",
    slots: [
        {
            text: ref("Dataing"),
            pannelDesc: "Handle the data processing that will feed the UI and Calc",
            mainMenuText: "Dataing",
            mainMenuSelect: selectSubMenu,
            subMenuText: "Commands",
            subMenuSelect: ()=>{},
            commands: [
                "run",
                "build",
                "data",
                "clean",
            ],
            cmdDir: "../../dataing/",
            shortcuts: [
                {
                    text: "run",
                    cmd: "run",
                },
                {
                    text: "build",
                    cmd: "build",
                },
            ]
        },
        {
            text: ref("Calc"),
            pannelDesc: "The calc, the assembly script thing",
            mainMenuText: "Calc",
            mainMenuSelect: selectSubMenu,
            subMenuText: "Output",
            subMenuSelect: ()=>{},
            commands: [
                "start",
                "asbuild:debug",
                "asbuild:release",
                "asbuild",
            ],
            cmdDir: "../../calc/",
            shortcuts: [
                {
                    text: "start",
                    cmd: "start",
                },
                {
                    text: "build",
                    cmd: "asbuild",
                },
            ],
        },
        {
            text: ref("UI"),
            pannelDesc: "The webapp that will hold the dex UI and the calc UI",
            mainMenuText: "UI",
            mainMenuSelect: selectSubMenu,
            subMenuText: "Shortcuts",
            subMenuSelect: ()=>{},
            commands: [
                "dev",
                "build",
                "preview",
                "build-only",
                "type-check"
            ],
            cmdDir: "../../ui/",
            shortcuts: [
                {
                    text: "dev",
                    cmd: "dev",
                },
            ],
        },
        {
            text: ref("Exit"),
            pannelDesc: "Just quit the application, simple as",
            mainMenuText: "Exit",
            mainMenuSelect: function(){
                if (this.text.value == this.mainMenuText){
                    this.text.value = "Are you sure?"
                    setTimeout(()=>{
                        this.text.value = this.mainMenuText
                    }, 2000)
                    return
                }
                //this termui has a hook on sigint that properly disconnect the mouse
                process.kill(process.pid, "SIGINT");
            },
            subMenuText: "Return",
            subMenuSelect: ()=>{
                if (store.cmd.isActive() == true){
                    store.cmd.terminate()
                    tuiData.slots[3].text.value = tuiData.slots[3].subMenuText
                    return
                }
                const NB_BOXES = tuiData.slots.length
                for (let i = 0; i < NB_BOXES; i++){
                    tuiData.slots[i].text.value = tuiData.slots[i].mainMenuText
                }
                store.isSidebarSubMenu = false
            },
            commands: [
            ],
            cmdDir: "",
            shortcuts: [],
        },

    ]
}