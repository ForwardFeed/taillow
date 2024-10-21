import { logDebug, logError, logInform, logPerf } from "../logging"

export type StateMap<States extends string> = Record<States, (reader: TokenReader<States, any>)=>void>
export type TransMap<States extends string> = Record<States, [string, States] | [string]>

export type TokenReaderOptions<States extends string, DataType> = {
    tokens?:     string[]
    stateRec:   StateMap<States>
    transRec?:  TransMap<States>
    startState: States
    data:       DataType
    name:       string
}

export class TokenReader<States extends string, DataType>{
    tokens:   string[];
    len:      number;
    i:        number;
    token:    string;
    stateRec: StateMap<States>;
    transRec: TransMap<States> | undefined;
    state:    States;
    data:     DataType;
    name:     string;
    constructor(options: TokenReaderOptions<States, DataType>){
        this.tokens   = options.tokens || []
        this.len      = this.tokens.length
        this.i        = 0
        this.token    = ""
        this.stateRec = options.stateRec
        this.transRec = options.transRec
        this.state    = options.startState
        this.data     = options.data
        this.name     = options.name
    }

    getNextToken(n = 0){
        this.token = this.tokens[this.i]
        this.i += 1 + n
        return this.token
    }

    start(tokens?: string[]): DataType{
        if (tokens){
            this.tokens = tokens
        }
        if (!this.tokens.length)
            throw "missing tokens in token reader"
        
        if (this.transRec)
            verifyTransitionRec(this.transRec, this.state)
        const t0 = logPerf()
        while(this.getNextToken()){
            if (this.transRec && this.transRec[this.state][0] === this.token){
                const nextState = this.transRec[this.state][1]
                if (nextState){
                    this.state = nextState
                } else {
                    this.end()
                    break
                }
               
            }
            try{
                this.stateRec[this.state](this)
            } catch(e){
                logError(`Error while reading state ${this.state}, reason : ${e}`)
            }
            
        }
        logPerf(t0, `reader: ${this.name}`)
        return this.data
    }
    end(){
        this.i = this.len
    }
    // utils
    /*getNextNotToken(not: string){
        while(this.getNextToken()){
            if (this.token != not)
                break
        }
        return this.token
    }*/
    /**
     * the -1 is because peek is always used after getNextToken, which makes weird to write peekToken(0) or getToken(0)
     * because this.i is incremented after getNextToken
     */
    peekToken(n: number){
        return this.tokens[this.i + n - 1]
    }
    getToken(n: number){
        this.i += n
        return this.tokens[this.i - 1]
    }

    checkToken(t: string): boolean{
        return this.token == t
    }
    /**
     * check a following sequence of token, undefined mean any
     * it uses Peek but the cursor is always the first token anyway 
     * so ["const", "u16"], means that this.token == "const" (is the sequence match)
     */
    checkPattern(...pattern: Array<string | undefined>){
        const len = pattern.length
        for(let i =0; i < len; i++){
            const part = pattern[i]
            if (!part)
                continue
            if (this.peekToken(i) != part)
                return false
        }
        return true
    }
    multiTokenPattern(wait: string, until: string, ignore=[] as string[]){
        const tokens = []
        let isAwaiting = true
        while(this.getNextToken()){
            if (isAwaiting){
                if (this.token == wait)
                    isAwaiting = false
                continue
            }
            if (this.token == until){
                break
            }
            if (ignore.includes(this.token)){
                continue
            }
            tokens.push(this.token)
        }
        return tokens
    }
    tokenToState(toMatch: string, state: States): boolean{
        if (this.token == toMatch){
            logDebug(`reader: ${this.name} Switching from ${this.state} to ${state}`)
            this.state = state
            return true
        }
        return false
    }
    pushCursor(n: number){
        this.i = this.i + n
        this.token = this.tokens[this.i]
        return this
    }
    /**
     * deactive current state, not to run it more, it's used in combinaison of the transition record
     */
    deactivateStateUntilTrans(){
        if(this.transRec && this.transRec[this.state][0]){
            const transT = this.transRec[this.state][0]
            while(this.getNextToken()){
                if (this.checkToken(transT)){
                    const nextState = this.transRec[this.state][1]
                    if (nextState){
                        this.state = nextState
                    } else {
                        this.end()
                    }
                    break
                }
            }
        }
    }
    parseC(waitOpenBracket = true): any{
        while(waitOpenBracket && this.token && this.token != "{"){
            this.getNextToken()
        }
        let object  = {} as any
        let identifier = ""
        let values = []
        let isArray = false
        while(this.getNextToken()){
            if (this.checkToken("[")){
                while(this.getNextToken()){
                    if (this.checkToken("]"))
                        break
                    identifier += this.token
                }
            }
            else if (this.checkToken(".")){
                identifier = this.getNextToken()
            }
            else if (this.checkToken(",")){
                if (values.length == 0){

                } else
                if (identifier){
                    object[identifier] = values
                } else { if (!isArray)
                        object = []
                    isArray = true
                    object.push(values)
                }
                values = []
                identifier = ""
            }
            else if (this.checkToken('}')){
                if (values.length == 0){

                } else
                if (identifier){
                    object[identifier] = values
                } else { if (!isArray)
                        object = []
                    isArray = true
                    object.push(values)
                }
                return object
            }
            else if (this.checkToken('{')){
                values = this.parseC(false)
            }
            else if (this.checkToken('=')){
            
            }
            else {
                values.push(this.token)
            }
        }
    }
    /**
     * a version that sucks less (still sucks tho)
     * @param waitOpenBracket 
     */
    parseCObj(waitOpenBracket = true): any{
        while(waitOpenBracket && this.token && this.token !== "{"){
            this.getNextToken()
        }
        let val: any
        let id: any
        function applyVal(toApplyval: any){
            if (id){
                if (val){
                    if (val[id]){
                        if (val[id].constructor.name !== "Array"){
                            val[id] = [val[id], toApplyval]
                        } else {
                            val[id].push(toApplyval)
                        }
                        
                    } else {
                        val[id] = toApplyval
                    }
                } else {
                    val = {}
                    val[id] = toApplyval
                }
            } else {
                if (val){
                    val.push(toApplyval)
                } else {
                    val = []
                    val.push(toApplyval)
                }
            }
            
        }
        while(this.getNextToken()){
            switch(this.token){
                case "{":
                    applyVal(this.parseCObj()) 
                break
                case "}":
                    return val
                case "[":
                    id = ""
                    while(this.getNextToken()){
                        if (this.checkToken("]"))
                            break
                        id += this.token
                    }
                break   
                case ".":
                    id = this.getNextToken()
                break
                case ",":
                break
                case "=":
                    while(this.getNextToken()){
                        if (this.checkToken(",")){
                            break
                        }
                        else if (this.checkToken("}")){
                            return val
                        }
                        else if (this.checkToken("{")){
                            applyVal(this.parseCObj()) 
                            break
                        }
                        else {
                            applyVal(this.token)
                        }
                    }
                break
                default:
                    applyVal(this.token)
                break
            }

        }
        return val || {}
    }
    parseCNoRecurse(waitOpenBracket = true): any{
        while(waitOpenBracket && this.token && this.token != "{"){
            this.getNextToken()
        }
        let object = {} as any
        let target = [object]
        let depth  = 0
        let value  = [] as any[]
        let identifier = ""
        while(this.getNextToken()){
            if (!~depth) 
                return object

            if (this.checkToken("[")){
                while(this.getNextToken()){
                    if (this.checkToken("]"))
                        break
                    identifier += this.token
                }
                continue
            }
            else if (this.checkToken(".")){
                identifier = this.getNextToken()
                continue
            }
            else if (this.checkToken(",")){
                if (identifier){
                    target[depth][identifier] = value
                } else {
                    target[depth][Object.keys(object).length] = value
                }
                value = []
                identifier = ""
                continue
            }
            else if (this.checkToken('}')){
                if (identifier){
                    target[depth][identifier] = value
                } else {
                    target[depth][Object.keys(object).length] = value
                }
                value = []
                identifier = ""
                depth--
                continue
            }
            else if (this.checkToken('{')){
                const nextObject = {}
                if (identifier){
                    target[depth][identifier] = nextObject
                } else {
                    target[depth][Object.keys(object).length] = nextObject
                }
                target.push(nextObject)
                depth++
                continue
            } else if (this.checkToken('=')){
                continue
            }
            else {
                value.push(this.token)
            }
        }
    }
}

export type ResolvedData<dataType> = {
    err?: boolean,
    data: dataType
}


function verifyTransitionRec<States extends string>(record: TransMap<States>, startSate: States){

    const statesPassed = [startSate]
    const passThroughtRecord = (state: States) =>{
        const rec = record[state]
        const nextState = rec[1]
        if (!nextState)
            return

        if (~statesPassed.indexOf(nextState)){
            throw "verifyTransitionMap: Found recursion with state: " + nextState + " . Please verify"
        } else {
            statesPassed.push(nextState)
            passThroughtRecord(nextState)
            
        }
    }
    passThroughtRecord(startSate)
    if (statesPassed.length < Object.keys(record).length){
        const missedStates = Object.keys(record).reduce((acc, cur) => {
            if (!~statesPassed.indexOf(cur as States)){
                acc.push(cur as States)
            }
            return acc
        }, [] as States[]) 
        logInform(`verifyTransitionMap: ${missedStates.length} states were missed\nmissed: ${JSON.stringify(missedStates)}`)
    }
}