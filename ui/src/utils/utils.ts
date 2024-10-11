

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