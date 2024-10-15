import { NestedString } from "../utils_types"
import { logInform, logPerf } from "../logging"
import { Delimiter, PreprocessorDirective as PD, PPMacros} from "./extractor_types"
import { readFile } from "node:fs/promises"
import { operatorSolvingFMap, nestedStringToPack, OperatorFunction, normalize, uncomment } from "./parse_utils"
import { tokenize } from "./tokenizer"



export type PProcessorData= {ppm: PPMacros, str: string}
export function initPProcessorData(): PProcessorData{
    return {
        ppm: new Map(),
        str: ""
    }
}

export function preprocessor(str: string, ppm: PPMacros= new Map()): PProcessorData{
    const ctx= new ContextParser(str, ppm)
    ctx.start()
    return {
        ppm: ctx.ppm,
        str: ctx.validTokens.join('')
    }
}

enum Mode {
    Read,
    DoNotRead,
}
enum IfState{
    InvalidSoFar,
    Validated,
    PreviouslyValidated
}
type TokenFunction= (ctx: ContextParser)=>void
type TokenModeFunc= {[key: string]: TokenFunction | undefined} 
type TokenFuncMap = {[key: string]: TokenModeFunc}

class ContextParser{
    forceSolve;
    i;
    mode;
    tokens;
    token;
    ppm;
    ifStates;
    validTokens;
    unsolved;
    line;
    constructor(text: string, ppm: PPMacros){
        this.tokens     = tokenize(text, {
            charAsTokens: [Delimiter.ENDLINE, Delimiter.SPACE],
            includeDQuote: true
        })
        this.token      = ""
        this.i          = 0;
        this.mode       = Mode.Read;
        this.ppm        = ppm;
        this.forceSolve   = false;
        this.ifStates   = [] as IfState[];
        this.validTokens= [] as string[];
        this.unsolved   = [] as string[];
        this.line       = [] as string[];
    }
    start(){
        const t0 = logPerf()
        this.parse()
        const t1 = logPerf(t0, `Pre-Processing: parse`)
        this.solveUnsolvedPPM()
        const t2 = logPerf(t1, `Pre-Processing: solving`)
        this.subtitute(this.validTokens)
        const t3 = logPerf(t2, `Pre-Processing: substitute`)
    }
    subtitute(tokens: string[]){
        const len = tokens.length
        let i = 0
        for (; i < len; i ++){
            const token = tokens[i]
            if (!this.ppm.has(token)){
                continue
            }
            const substitutes = this.ppm.get(token) as string[]
            
            // macro function
            if (tokens[i+1] == Delimiter.OPNPAR){ 
                const indexSub = i
                //skip the opening parenthesis
                tokens[++i] = ""
                let argT   = ""
                let brckCount = 0
                let obj = [] as string[] // arry of object for bracketted object
                const args = []
                for (; i < len;){
                    argT = tokens[++i]
                    tokens[i] = ""
                    if (argT == Delimiter.OPNBRCK){
                        if (!brckCount)
                            obj.length = 0
                        brckCount++
                    }
                    if (brckCount){
                        obj.push(argT)
                        if (argT == Delimiter.CLSBRCK){
                            brckCount--
                            if (!brckCount)
                                args.push(obj.join(''))
                        }
                        continue
                    }
                    if (argT == Delimiter.CLSPAR){
                        break
                    }
                    if (argT == Delimiter.COMMA || argT == Delimiter.SPACE){
                        continue
                    }
                    args.push(argT)
                }
                const __VA_ARGS__ = []
                // because it's a pointer, if modified directly it does bad stuff, so it needs to be copied
                const newSubstitute = substitutes.slice(0)
                for (let i = 0; i < args.length; i++){
                    let hasBeenUsed = false
                    const arg = args[i]
                    for (let j = 0; j < newSubstitute.length; j++){
                        if (newSubstitute[j] == `$(${i})`){
                            newSubstitute[j] = arg
                            hasBeenUsed = true
                        }
                    }
                    if (!hasBeenUsed)
                        __VA_ARGS__.push(arg)
                }
                let has__VA_ARGS__Used = false
                for (let k = 0, klen = newSubstitute.length; k < klen; k++){
                    if (newSubstitute[k] == "__VA_ARGS__"){
                        newSubstitute[k] = __VA_ARGS__.join('')
                        has__VA_ARGS__Used = true
                    }
                }
                //imitates __VA_OPT__ without really... well it's good enough
                if (!has__VA_ARGS__Used){
                    for (let k = 0, klen = newSubstitute.length; k < klen; k++){
                        if (newSubstitute[k].match(/\$\([0-9]\)/)){
                            newSubstitute[k] = ""
                        }
                    }
                }
                //resolve subfunctions if there is
                this.subtitute(newSubstitute)
                tokens[indexSub] = newSubstitute.join('')
            } 
            // string simple substitution
            else {
                this.subtitute(substitutes)
                tokens[i] = substitutes.join('')
            }
        }
    }
    getNextToken(){
        if (this.token == Delimiter.ENDLINE){
            this.line.length = 0
        }
        this.i++
        this.token = this.tokens[this.i]
        this.line.push(this.token)
        return this.token 
    }
    getNextNonSpaceToken(){
        while(this.getNextToken() == Delimiter.SPACE)
            continue
        return this.token 
    }
    peek(n=1){
        return this.tokens[this.i + n]
    }
    peekNonSpaceToken(n: number = 1){
        let increment = 1
        let tkn       = ""
        while(tkn = this.tokens[this.i + increment++]){
            if (tkn == Delimiter.SPACE)
                continue
            if (!--n){
                return tkn
            }
        }
        return tkn
    }
    continueToEndl(){
        while(this.getNextNonSpaceToken()){
            if (this.token == Delimiter.ENDLINE)
                break
        }
    }
    parse(){
        this.mode            = Mode.Read;
        this.ifStates.length = 0;
        this.i               = 0;
        this.line.length     = 0;

        if (!this.tokens.length)
            return
        this.i--
        while(this.getNextToken()){
            if (this.token[0] == "#"){
                const func = PPModeMap[this.mode][this.token]
                if (func){
                    func(this)
                }
            } else if (this.mode == Mode.Read){
                this.validTokens.push(this.token)
            }
        }
    }
    //must only be run at the end as it will delete the tokens
    solveUnsolvedPPM(){
        this.tokens          = this.unsolved.slice(0)
        let len              = this.unsolved.length
        this.unsolved.length = 0;
        this.parse()
        if (len > this.unsolved.length && !this.forceSolve){
            this.solveUnsolvedPPM()
        }
        if(this.unsolved.length){
            this.forceSolve = true
            this.solveUnsolvedPPM()
        }
    }
    updateReadStatus(){
        this.mode= ~this.ifStates.findIndex(x=> x== IfState.InvalidSoFar || x == IfState.PreviouslyValidated) ? Mode.DoNotRead : Mode.Read
    } 
    currIfState(newState?: IfState){
        if (newState != undefined){
            this.ifStates[this.ifStates.length - 1]= newState
            this.updateReadStatus()
        }
        return this.ifStates[this.ifStates.length - 1]
    }
    addIfState(newState: IfState){
        this.ifStates.push(newState)
        this.updateReadStatus()
    }
    removeIfState(){
        this.ifStates.splice(this.ifStates.length - 1, 1)
        this.updateReadStatus()
    }
}


const commonFunctions: TokenModeFunc= {
    [PD.ELIF]: (ctx: ContextParser)=>{
        if (ctx.currIfState() == IfState.InvalidSoFar){
            const resolve   = resolveMacroExpression(ctx)
            if (!resolve.err && resolve.data){
                ctx.currIfState(IfState.Validated)
            } else {
                ctx.currIfState(IfState.InvalidSoFar)
            }
        } else {
            ctx.currIfState(IfState.PreviouslyValidated)
            ctx.continueToEndl()
        }
        
    },
    [PD.ELSE]: (ctx: ContextParser)=>{
        if (ctx.currIfState()== IfState.InvalidSoFar){
            ctx.currIfState(IfState.Validated)
        } else {
            ctx.currIfState(IfState.InvalidSoFar)
        }
    },

    [PD.ENDIF]: (ctx: ContextParser)=>{
        ctx.removeIfState()
    },
    
    
}

const PPModeMap: TokenFuncMap= {
    [Mode.Read]: {
        [PD.INCLUDE]: (ctx: ContextParser)=>{
            ctx.continueToEndl()
        },
        [PD.ASSERT]: (ctx: ContextParser)=>{
            ctx.continueToEndl()
        },
        [PD.DEFINE]: (ctx: ContextParser)=>{
            const definer = ctx.getNextNonSpaceToken()
            if (ctx.ppm.has(definer)){
                return ctx.continueToEndl()
            }
            if (ctx.peekNonSpaceToken() == Delimiter.ENDLINE){
                ctx.ppm.set(definer, [""])
                return
            }
            if (ctx.peek() == Delimiter.OPNPAR){
                //goto resolve function
                if (true){ // disabled functions
                    preprocessFunction(ctx)
                } else {
                    ctx.continueToEndl()
                }
                return
            }
            const resolve   = resolveMacroExpression(ctx)
            if (resolve.err){
                if (ctx.forceSolve){
                    const index = ctx.line.indexOf(definer)
                    ctx.ppm.set(definer, ctx.line.slice(index + 1))
                } else {
                    ctx.unsolved = ctx.unsolved.concat(ctx.line)
                }
                return
            } else{
                ctx.ppm.set(definer, [resolve.data + ""])
            }  
        },
        [PD.UNDEFINE]: (ctx: ContextParser)=>{
            ctx.ppm.delete(ctx.getNextNonSpaceToken())
        },
        [PD.IFDEF]: (ctx: ContextParser)=>{
            if (ctx.ppm.has(ctx.getNextNonSpaceToken())){
                ctx.addIfState(IfState.Validated)
            } else {
                ctx.addIfState(IfState.InvalidSoFar)
            }
        },
        [PD.IFNDEF]: (ctx: ContextParser)=>{
            if (ctx.ppm.has(ctx.getNextNonSpaceToken())){
                ctx.addIfState(IfState.InvalidSoFar)
            } else {
                ctx.addIfState(IfState.Validated)
            }
        },
        [PD.IF]: (ctx: ContextParser)=>{
            const resolve   = resolveMacroExpression(ctx)
            if (!resolve.err && resolve.data){
                ctx.addIfState(IfState.Validated)
            } else {
                ctx.addIfState(IfState.InvalidSoFar)
            }
        },
        [PD.ELIF]: commonFunctions[PD.ELIF],
        [PD.ELSE]: commonFunctions[PD.ELSE],
        [PD.ENDIF]: commonFunctions[PD.ENDIF],
    },
    [Mode.DoNotRead]: {
        [PD.IFDEF]: (ctx: ContextParser)=>{
            ctx.addIfState(IfState.Validated)
        },
        [PD.IFNDEF]: (ctx: ContextParser)=>{
            ctx.addIfState(IfState.Validated)
        },
        [PD.IF]: (ctx: ContextParser)=>{
            ctx.addIfState(IfState.Validated)
        },
        [PD.ELIF]: commonFunctions[PD.ELIF],
        [PD.ELSE]: commonFunctions[PD.ELSE],
        [PD.ENDIF]: commonFunctions[PD.ENDIF],
    }
}

type ResolvedData = {
    err?: boolean,
    data: number
}

export function resolveMacroExpression(ctx: ContextParser): ResolvedData{
    const  trySolveToken = (token: string) => {
        const toSolve = +token
        if (isNaN(toSolve)){
            if (token === "FALSE") {
                return {
                    data: 0
                }
            }
            if (token === "TRUE") {
                return {
                    data: 1
                }
            }
            if(!ctx.ppm.has(token)){
                return {
                    err: true,
                    data: 0
                }
            } else {
                const x = ctx.ppm.get(token) || ""
                return trySolveToken(x[0])
            }
        }
        return {
            data: toSolve
        }
    }
    let solve   = 0;
    let token   = ""
    let unsolvable = false
    let operator   = undefined as undefined | OperatorFunction;
    while(token = ctx.getNextNonSpaceToken()) {
        if (token == Delimiter.CLSPAR || token == Delimiter.ENDLINE || token == Delimiter.DD ) {
            return {
                err: unsolvable,
                data: solve
            }
        }
        if (token == Delimiter.OPNPAR) {
            const temp =  resolveMacroExpression(ctx)
            if (temp.err){
                unsolvable = true
            } else {
                token = temp.data + ""
            }
        } else if (token == Delimiter.QUESTION){
            if (!unsolvable && solve){
                const toReturn =  resolveMacroExpression(ctx)
                resolveMacroExpression(ctx) // will be ignored
                return toReturn
            } else {
                resolveMacroExpression(ctx) // will be ignored
                return resolveMacroExpression(ctx)
            }
        }
        if (unsolvable){
            continue
        }
        if (operator){
            const temp =  trySolveToken(token)
            if (unsolvable = temp.err || false)
                continue
            solve = operator(solve, temp.data)
            operator = undefined
            continue
        } else {
        
        if (operator = operatorSolvingFMap[token]) {
            continue
        } else {
            const valueToken = trySolveToken(token)
            if (valueToken.err){
                unsolvable = true
            } else {
                solve = valueToken.data
            }
        }
        }
        
        
    }
    return {
        err: unsolvable,
        data: solve
    }
}
enum PFState{
    Arguments,
    ArgsWaitCLSBRCK,
    Body,
}
function preprocessFunction(ctx: ContextParser): ResolvedData{
    function pushArg(){
        if (curArg)
            args.push(curArg)
        curArg = ""
    }
    let VAExtend = ""
    const PFStateMap: {[key in PFState]: ()=>void} = {
        [PFState.Arguments]: ()=>{
            if (token == Delimiter.SPACE){
                return
            } 
            if (token == Delimiter.OPNBRCK){
                state = PFState.ArgsWaitCLSBRCK
                return
            }
            if (token == "..."){
                curArg = "__VA_ARGS__"
            }
            if (token == Delimiter.CLSPAR){
                pushArg()
                state = PFState.Body
            } else 
            if (token == Delimiter.COMMA){
                pushArg()
            } else if (ctx.peek(1) == "..."){
                //if it is not separated by a space THEN it's the one that is in fact VA
                VAExtend = token
                curArg = "__VA_ARGS__"
                pushArg()
                ctx.getNextToken()
                return
            }
            else {
                curArg += token
            }
        },
        [PFState.ArgsWaitCLSBRCK]: ()=>{
            if (token == Delimiter.CLSBRCK){
                state = PFState.Arguments
            } else {
                curArg += token
            }
        },
        [PFState.Body]: ()=>{
            if (token.includes("##")){
                const splited = token.split("##")
                for (let j = 0, len = splited.length; j < len;j++){
                    const split = splited[j]
                    let substitute = splited[++j]
                    if (!substitute){
                        substitute = ctx.getNextNonSpaceToken() 
                    }
                    if (!args.includes(substitute)){
                        /*logWarn("preprocessing ## substitutor failed to understand the following:" +
                            "\ntoken: " + token + "\nsubstitute: "  + substitute+ "\nline: " + ctx.line.join('') + `\nargs:` + args.join)*/
                        //invalid = true
                        body.push(split, substitute)
                        continue
                    }
                    body.push(split, `$(${args.indexOf(substitute)})`)
                }
                
            } else
            if (args.includes(token)){
                body.push("$("+ args.indexOf(token)+")")
                
            } else {
                if (token == VAExtend){
                    token = "__VA_ARGS__"
                    body.push("__VA_ARGS__")
                } else {
                    body.push(token)
                }
                
            }
        }
    }
    const definer = ctx.token
    const args    = [] as string[];
    let body      = [] as string[];
    let invalid   = false
    let curArg    = ""
    let token     = ""
    let state     = PFState.Arguments

    ctx.getNextNonSpaceToken() // it's "(" we already know that
    while(token = ctx.getNextToken()){
        if (token == Delimiter.ENDLINE)
            break
        PFStateMap[state]()
    }
    if (invalid){
        return {
            err: true,
            data: 0
        }
    }
    ctx.ppm.set(definer, body)
    return {
        err: false,
        data: 0
    }
}



type FilePacks= Array<string[]>
/*
export function cPreprocessFileNest(fileNest: NestedString,
                                    cb: (ppmd: PProcessorData)=>void,
                                    ppmd: PProcessorData)
{
    const packs: FilePacks = nestedStringToPack(fileNest)
    readFilePackRecursivelyAndPreprocess(packs, cb, ppmd)
}
Notice: If a path starts with "#" the file is not preprocessed    
*/
export function cPreprocessFileNest2(fileNest: NestedString,
                                     ppmd: PProcessorData,
                                     cInjection: string = "",
                                     filesSeparator: string = ""): Promise<PProcessorData>
{
    if (cInjection)
        ppmd = preprocessor(normalize(cInjection), ppmd.ppm)
    filesSeparator = "\n" + filesSeparator + "\n"
    const packs: FilePacks = nestedStringToPack(fileNest)
    const promises = [] as Promise<string[]>[]
    const preprocessInformation = [] as Array<0 | 1 | 2>
    let count = 0
    let firstFileName = ""
    let lastFileName  = ""
    for (const pack of packs){
        count += pack.length
        promises.push(Promise.all(pack.map(x => 
            {
                // to help to track debug
                if (!firstFileName){
                    firstFileName = x
                } else {
                    lastFileName = x
                }
                if (~x.indexOf("/!")){
                    preprocessInformation.push(1)
                    //give information not to preprocess it
                    x = x.replace(/!/, '')
                } else if (~x.indexOf("/#")){
                    preprocessInformation.push(2)
                    //give information to only pull PPMs
                    x = x.replace(/#/, '')
                } else {
                    preprocessInformation.push(0)
                }
                
                return readFile(x, "utf8")
            })))
    }
    const t0 = logPerf()
    return new Promise(((resolve, reject)=>{
        Promise.all(promises)
            .then((packs)=>{
                const t1 = logPerf(t0, `Filenest opening of ${firstFileName}${lastFileName ? `...${lastFileName}` : ""}`)
                for (const pack of packs){
                    for(const text of pack){
                        const processInfo = preprocessInformation.splice(0, 1)[0]
                        if (processInfo == 0){
                            const newPpmd = preprocessor(normalize(text), ppmd.ppm)
                            ppmd.str = ppmd.str  +  newPpmd.str + filesSeparator
                        } 
                        else if (processInfo == 2){
                            preprocessor(normalize(text), ppmd.ppm)
                        } else {
                            ppmd.str = ppmd.str +  normalize(text) + filesSeparator
                        }
                    }
                }
                logPerf(t0, `Filenest parsing of ${firstFileName}${lastFileName ? `...${lastFileName}` : ""}`)
                resolve(ppmd)
            })
                
            .catch((err)=>{
                reject(err)
            })
    }))
}
