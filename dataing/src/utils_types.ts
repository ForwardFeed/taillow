
export type NestedString = string | string[] | NestedString[]

/* this retroactive type pains to read, but with some examples it's quite simple
const _simple1  : NestedString = ""
const _simple2  : NestedString = ["", ""]
const _complex1 : NestedString = ["", ["", ""]]
const _complex2 : NestedString = ["", "", ["", "", ["", ""]]]
*/

export type StringPacks= Array<string[]>