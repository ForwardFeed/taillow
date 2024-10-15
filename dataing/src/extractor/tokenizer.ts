import { logPerf } from "../logging"


type TokenizeOptions = {
    readonly charAsTokens: string[],
    readonly includeDQuote?: boolean,
}

const defaultTokenizeOptions: TokenizeOptions =  {
    charAsTokens: [],
    includeDQuote: false,
}

export function tokenize(text: string, options: TokenizeOptions = defaultTokenizeOptions): string[]{
    const t0 = logPerf()
    let peek = ""
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
            case "/":
                peek = text[i+1]
                //single line comment
                if (peek === "/"){
                    push()
                    while(char = text[++i]){
                        if (char == "\n")
                            break
                    }
                    continue
                    // multi lines comment
                } else if (peek === "*"){
                    push()
                    while(char = text[++i]){
                        if (char == "*" && text[i + 1] == "/"){
                            break
                        }
                    }
                    continue
                } 
            break
            case "*":
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
                peek = text[i + 1]
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
    logPerf(t0, `Tokenized ${len} chars into ${tokens.length} \
tokens ${Math.trunc(len / ((Date.now() - t0) || 1))}c/ms ${Math.trunc(tokens.length / ((Date.now() - t0) || 1))}t/ms`)
    return tokens
}