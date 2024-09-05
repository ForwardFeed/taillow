import { reactive } from "vue";
import { Ran } from "./types";
import { Command } from "./run_command";

// import { tuiData } from './tui_data';
// const NB_BOXES = tuiData.slots.length
// if you want to know the max number for sideBarCursor for exemple check ^

type Store = {
    sideBarCursor: Ran<4>
    sidebarMainMenuSelection: Ran<4>
    isSidebarSubMenu: boolean,
    isSideBarSelected: boolean
    title: string,
    cmd: Command
    shortcut: number
    debug: string
}
const _store: Store = {
    sideBarCursor: 0,
    sidebarMainMenuSelection: 0,
    isSidebarSubMenu: false,
    isSideBarSelected: true,
    title: "",
    cmd: new Command(),
    debug: "",
    shortcut: 0,
}

export const store: Store = reactive(_store)


export function initStore(){
    store.isSideBarSelected = true
}