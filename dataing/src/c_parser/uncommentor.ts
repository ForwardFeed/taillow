import { logInform } from "../logging"

enum State {
    Free,
    SingleLine,
    MultiLine
}

export function uncomment(text: string): string{

    let char       = ""
    let i          = 0
    let state      = State.Free
    let freeText   = "" // free of commments, Yippee
    const t0 = Date.now()
    // keeping this in case, but this is using regex for now
    /*
    const len = text.length
    for(;i < len; i++){
        char = text[i]
        if (state == State.Free && char == "/" ){
            const peek = text[i + 1] 
            if (peek == "/"){
                state = State.SingleLine
                continue
            } else if (peek == "*"){
                state = State.MultiLine
                i++
                continue
            }
        } else if (state == State.SingleLine){
            if (char == "\n"){
                state = State.Free
            }
            continue
        } else if (state == State.MultiLine){
            const peek = text[i + 1] 
            if (char == "*" && peek == "/"){
                state = State.Free
            }
            continue
        }
        freeText += char
    }*/
    // regex is sooo much faster
    freeText = text.replace(/\/\/[^\n]+/g, '').replace(/\/\*[\s\S]*?\*\//g, "")
    logInform(`uncommenting took: ${Date.now() - t0}ms`)
    return freeText
}