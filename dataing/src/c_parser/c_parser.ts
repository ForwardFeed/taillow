import { logInform, logWarn } from "../logging";
import { tokenize } from "./tokenizer";
import { C_Keywords, Delimiter } from "./types";

type Variable = {
    type: string,
    label: string,
    value: string,
    isStruct: boolean,
    isSubscritable: boolean,
}

enum Mode{
    Free,
    Typed,
    Labeled,
    AfterEqual,
}
function initVariable():Variable{
    return {
        type: "",
        label: "",
        value: "",
        isStruct: false,
        isSubscritable: false,
    }
}
export function cParser(text: string){
const pushVariable = () => {
    varStore.push(variable)
    variable = initVariable();
    mode = Mode.Free
}

const modeTree: {[key in Mode]: ()=>void} = {
    [Mode.Free]: () => {
        if (token == "struct"){
            variable.isStruct = true
        } else if (C_Keywords.includes(token)) {
            //ignore
            return;
        } else {
            variable.type = token;
            mode = Mode.Typed
        }
        
    },
    [Mode.Typed]: ()=> {
        variable.label = token;
        mode = Mode.Labeled
    },
    [Mode.Labeled]: ()=> {
        if (token == Delimiter.EQUALS){
            mode = Mode.AfterEqual
        } else if (token == Delimiter.OPNABRCK){
            variable.isSubscritable = true
        }
        else if (token == Delimiter.SEMICOL){
            pushVariable()
        } else {
            logWarn("unset " + token)
        }
    },
    [Mode.AfterEqual]: ()=>{
        if (token == Delimiter.SEMICOL){
            pushVariable()
        } else {
            variable.value += token
        }
    }
}
const tokens   = tokenize(text)
const varStore = [] as Variable[]
let variable   = initVariable()
let token = ""
let i     = 0
let len   = token.length
let mode  = Mode.Free

function nextToken(){
    return token = tokens[i++]
}
while(nextToken()){
    modeTree[mode]()
}
console.log(varStore)

}

