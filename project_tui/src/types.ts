export type FixedSizeArray<N extends number, T> = N extends 0 ? never[] : {
    0: T;
    length: N;
} & ReadonlyArray<T>;


export type Ran<T extends number> = number extends T ? number :_Range<T, []>;
type _Range<T extends number, R extends unknown[]> = R['length'] extends T ? R[number] : _Range<T, [R['length'], ...R]>;


//manually imported
export type Colors = 
    'black' |
    'red' |
    'green' |
    'yellow' |
    'blue' |
    'magenta' |
    'cyan' |
    'white' |
    'gray' |
    'grey' |
    'blackBright' |
    'redBright' |
    'greenBright' |
    'yellowBright' |
    'blueBright' |
    'magentaBright' |
    'cyanBright' |
    'whiteBright';


export enum UIColors{
    NON_SELECTABLE = "yellow",
    UNSELECTED = "blue",
    SELECTED = "greenBright",
    RUNNING = "magenta",
    RUNNING2 = "magreygentaBright",
    RUNNING3 = "grey",
    RUNNING4 = "magenta",
}
 