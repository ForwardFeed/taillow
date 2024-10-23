import { useErrorStore } from "@/stores/errors"


export function objectKeys<T extends object>(obj: T): Array<keyof T>{
    return Object.keys(obj) as Array<keyof typeof obj>
}

// structure copy tends to break reactivity
// this does not 
export function copyObjectProps<T extends object>(target: T, origin: T,){
    const keys = objectKeys(target)
    for(const key of keys){
        const field = target[key]
        if (typeof field === "object"){
            //@ts-ignore
            copyObjectProps(target[key], origin[key])
        } else {
            target[key] = origin[key]
        }
    }
}


export function copyToClipboard(text: string, showError=false){
    if (!navigator.clipboard){
        if (showError){
            useErrorStore().add("Failed to copy to clipboard, the browser doesn't support it")
        }
        return
    }
    navigator.clipboard.writeText(text).then(function() {
        return
    }, function(err) {
        useErrorStore().add("Failed to copy to clipboard: " + err)
    });

}

/**
 * used for exhaustive switch statements
 */
export function assertUnreachable(x: never): never {
    throw new Error("Didn't expect to get here: " + x);
}
