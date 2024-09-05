import chalk from "chalk";
import { store } from "./store";
import { tuiData } from "./tui_data";
import { exec } from "node:child_process";
import terminate from "terminate";

export interface CommandAnimParam {
    interval?: number;
    cb: ()=>void;
    end: ()=>void;
    cycleLeft?: number;
}

export class CommandAnim{
    interval: { restart: () => void; stop: () => void; }
    cycleLeft: number;
    shouldStop: boolean

    constructor (cmdAnim: CommandAnimParam){
        this.shouldStop = false
        this.cycleLeft = cmdAnim.cycleLeft || 4;
        this.interval = useInterval(()=>{
            if (!store.cmd.isActive())
                this.shouldStop = true

            if (this.shouldStop)
                this.cycleLeft--

            if (!this.cycleLeft){
                this.interval.stop()
                cmdAnim.end()
            } else {
                cmdAnim.cb()
            }
        
        }, cmdAnim.interval || 200);
    }
}

export type CommandParam = {
    cmd: string
    cwd: string
}

export class Command{
    active: boolean;
    pid: number;
    shortOut: string;
    out: string;
    lastSubmenu: number;

    constructor(){
        this.pid = 0;
        this.shortOut = ""
        this.out = ""
        this.active = false
        this.lastSubmenu = -1
    }
    /**
     * run a command, if a command is already running then don't run
     * @param param 
     * @returns 
     */
    run(param: CommandParam): void{
        // prevent to run multiple time a command
        if (this.active == true)
            return
        // show in the shortcut debug, that we changed submenu
        if (this.lastSubmenu == -1 || this.lastSubmenu != store.sidebarMainMenuSelection){
            this.lastSubmenu = store.sidebarMainMenuSelection
            this.shortOut += `----\
${chalk.magenta.bgBlack.bold(tuiData.slots[store.sidebarMainMenuSelection].mainMenuText)}----\n`
        }
        
        const command = `${param.cmd}`
        const child = exec(command, {cwd: param.cwd}, (err)=>{
            if (err){
                if (err.killed || err.signal){
                    this.shortOut += `${chalk.magentaBright.bgBlack.bold("Interrupted")} by ${err.signal}\n`
                    this.out +=  `${chalk.magentaBright.bgBlack.bold("Interrupted")} by ${err.signal}\n`
                } else {
                    this.out += chalk.red(err.message)
                    this.shortOut += `${chalk.redBright.bgBlack.bold("Err:")} ${command}\n`
                }
                this.pid = 0
                this.active = false
                return
            }
        })
        if (child.pid){
            this.pid = child.pid
            tuiData.slots[3].text.value = "Interrupt"
            this.active = true
        }
        child.on('spawn', ()=>{
            this.shortOut += `${chalk.whiteBright.bgBlack.bold(`Started(${child.pid}):`)} ${command}\n`
        })
        child.on('close', (code, signal)=>{
            this.shortOut += `${chalk.whiteBright.bgBlack.bold(`Exit code(${code})`)}${signal? ` | s: ${signal}` : ""}\n`
            this.active = false
            tuiData.slots[3].text.value = tuiData.slots[3].subMenuText
        })
        child.on('disconnect', ()=>{
            this.shortOut += `${chalk.yellow.bgBlack.bold("Disconnected")}\n`
            this.active = false
            tuiData.slots[3].text.value = tuiData.slots[3].subMenuText
        })
        child.stdout?.on('data', (data)=>{
            this.out += data
        })
        child.stderr?.on('data', (data)=>{
            this.out += data
        })
    }
    isActive(set?: boolean): boolean{
        if (set == undefined)
            return this.active
        this.active = set
        return this.active
    }
    terminate(): void{
        if (!this.active)
            return
        this.isActive(false)
        terminate(this.pid, "SIGINT")
    }
}