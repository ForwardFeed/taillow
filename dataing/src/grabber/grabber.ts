import { PProcessorData, cPreprocessFileNest2 } from "../extractor/preprocessor"
import { tokenize } from "../extractor/tokenizer"
import { extendNestedFilePathWithProjectPath } from "../extractor/parse_utils"
import { logWarn } from "../logging"
import { TokenReader} from "./token_reader"
import { chosenConfig } from "../config_handler"
import { NestedString } from "../../../config_types"

export type OptStartGrabbin = {
    projectPath: string,
    cInject: string,
    fileSeparator: string,

}
function initOptStartGrabbin(param: Partial<OptStartGrabbin>): OptStartGrabbin{
    return {
        projectPath: param.projectPath || chosenConfig.folder,
        cInject: param.cInject || "",
        fileSeparator: param.fileSeparator || ""
    }
}

export type ParamStartGrabbing<T extends string, S> = {
    reader: TokenReader<T,S>,
    filenest: NestedString,
    finalCb: (t:S)=>void,
    precursor: PProcessorData,
    processFunction?: (ppm: PProcessorData)=>void ,
    options: Partial<OptStartGrabbin>
}

/**
 * Tried to make this usefull
 * @param reader 
 * @param filenest 
 * @param finalCb 
 * @param processFunction 
 * @param projectPath 
 * @param precursor 
 * @param cInject 
 * @param filesSeparator 
 */
export function startGrabbin<T extends string, S>(
    reader: TokenReader<T,S>,
    filenest: NestedString,
    finalCb: (t:S)=>void,
    processFunction: (ppm: PProcessorData)=>void = (filedata)=>{
        finalCb(reader.start(tokenize(filedata.str)))
    },
    precursor: PProcessorData,
    options: Partial<OptStartGrabbin>,
){
    const initOptions = initOptStartGrabbin(options)
    cPreprocessFileNest2(extendNestedFilePathWithProjectPath(filenest, initOptions.projectPath),
        precursor, initOptions.cInject, initOptions.fileSeparator)
    .then(processFunction)
    .catch((err)=>{
        logWarn(err)
    })
}
