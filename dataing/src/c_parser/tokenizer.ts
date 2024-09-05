import { logInform } from "../logging"


type TokenizeOptions = {
    readonly charAsTokens: string[],
    readonly includeDQuote?: boolean,
    readonly informTime?: boolean
}

const defaultTokenizeOptions: TokenizeOptions =  {
    charAsTokens: [],
    includeDQuote: false,
    informTime: false
}

export function tokenize(text: string, options: TokenizeOptions = defaultTokenizeOptions): string[]{
    const t0 = Date.now()
    let i = 0
    const len = text.length
    const tokens = []
    let token = ""
    let char = ""
    const push = ()=>{
        if (!token)
            return
        tokens.push(token)
        token = ""
    }
    for(; i < len; i++){
        char = text[i]
        if (options.charAsTokens.includes(char)){
            push()
            tokens.push(char)
            continue
        }
        switch (char){
            case ".":
                push()
                if (text[i + 1] == "." && text[i + 2] == "."){
                    tokens.push("...")
                    i+=2
                } else {
                    tokens.push(char)
                }
                break
            case ",":
            case ";":
            case "(":
            case ")":
            case "[":
            case "]":
            case "{":
            case "}":
            case "?":
            case ":":
                push()
                tokens.push(char)
                break;
            case " ":
            case "\n":
            case "\t":
                push()
                break
            case "*":
            case "/":
            case "%":
            case ">":
            case "<":
            case "=":
                push()
                token = char
                if (text[i + 1] == "="){
                    token += "="
                    i++
                }
                push()
                break
            case "+":
            case "-":
            case "|":
            case "&":
            case "^":
            case "~":
                push()
                token = char
                const peek = text[i + 1]
                if (peek == char){
                    token += char
                    i++
                } else if (peek == "="){
                    token += "="
                    i++
                }
                push()
                break
            case "\"":
                push()
                if (options.includeDQuote)
                    token += char
                while(char = text[++i]){
                    if (char == "\\"){
                        char = text[++i]
                        if (char == "\n")
                            continue
                        if (char == "n"){
                            token += "\n"
                            continue
                        }
                            
                    } else if (char == "\""){
                        break
                    }
                    token += char
                }
                if (options.includeDQuote)
                    token += char
                push()
            break;
            default:
            if (char == "\\"){
                char = text[++i]
                if (char == "\n")
                    continue
            }
            token += char
        }
    }
    push()
    if (options.informTime){
        const delta = Date.now() - t0
        logInform(`Tokenized ${len} chars into ${tokens.length} tokens, in ${delta} ms : ${Math.trunc(len / (delta || 1))}t/ms`)
    }
        
    return tokens
}