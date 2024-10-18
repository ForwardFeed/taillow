import { PProcessorData } from "../extractor/preprocessor";
import { logInform, logError } from "../logging";

export type CallGrab<T, S> = {
    fn: (precursor: PProcessorData, cb: (any: S)=>void)=>void,
    field: ((t: T, any: S)=>void) | keyof T ,
    endMsg: string,
}
/*
* used if fled is a function so you have typechecking on it  
*/
export function initCallGrab<T, S>(fn: (precursor: PProcessorData, cb: (any: S)=>void)=>void,
    field:  ((t: T, any: S)=>void) | keyof T, endMsg: string): CallGrab<T,S>{
    return {
        fn: fn,
        field: field,
        endMsg: endMsg
    }
}

export class CallbackTracker<T>{
    precursor: PProcessorData;
    n: number;
    sharedObject: T;
    finalCb: (t: T)=>void;
    callsGrabs: CallGrab<T, any>[];
    constructor(sharedObject: T, finalCb: (t: T)=>void, callsGrabs: CallGrab<T, any>[], precursor: PProcessorData){
        this.n = 0
        this.sharedObject = sharedObject
        this.finalCb = finalCb
        this.callsGrabs = callsGrabs
        this.precursor = precursor
    }
    start(){
        if (this.n >= this.callsGrabs.length)
            throw "CallBackTracker cannot be run twice without being destroyed in between"
        for (const callGrab of this.callsGrabs){
            callGrab.fn(structuredClone(this.precursor), (data)=>{
                if (typeof callGrab.field === "function"){
                    callGrab.field(this.sharedObject, data)
                } else {
                    this.sharedObject[callGrab.field] = data
                }
                this.finished()
            })
        }
    }
    finished(inform?: string){
        if (inform){
            logInform(inform)
        }
        if (this.n >= this.callsGrabs.length)
            throw "called finished more than expected"
        if (++this.n >= this.callsGrabs.length){
            try{
                this.finalCb(this.sharedObject)
            } catch(err){
                logError("error in final CB in callback tracker" + err + "")
            }
            
        }
    }
}