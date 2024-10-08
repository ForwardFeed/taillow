

export function isBool(val: unknown, text=""){
    if (typeof val !== "boolean") throw new Error("Not a Boolean" + text ? " " + text :"!")
}

export function isArray(val: unknown, text=""){
    if (typeof val !== "object" || val == null || val.constructor !== Array)  throw new Error("Not an Array" + text ? " " + text :"!")
}