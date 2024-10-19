import { PProcessorData, cPreprocessFileNest2 } from "../../extractor/preprocessor"
import { tokenize } from "../../extractor/tokenizer"
import { extendNestedFilePathWithProjectPath } from "../../extractor/parse_utils"
import { projectPath } from "../../config_handler"
import { logError, logWarn } from "../../logging"
import { TokenReader} from "../token_reader"
import { BattleMonVanilla, ER21BattleMon, ER21Trainer, TrainerVanilla } from "./trainers"
import { on } from "events"
import { strAsBool, strOrArrayToArrayFilter } from "../utils"


type ER21TrainerMap = Map<string, ER21Trainer>
// Simplify the signature
type Reader = TokenReader<TemplateState, ER21TrainerMap>

// list of all states you go throught
type TemplateState = "trainer_parties" | "trainers" | "battle_setup_await" | "battle_setup"

const ptrParties: Map<string, ER21BattleMon[]>  = new Map()

const XStateMap: Record<TemplateState, (r: Reader)=>void> = {
    trainer_parties: function (r: Reader): void {
        if(r.checkPattern("const", "struct", "TrainerMonItemCustomMoves")){
            const ptr = r.getToken(3)
            const obj = r.parseCObj(true)
            ptrParties.set(ptr, obj.map((x: any) => {return {
                zeroSpeedIV: x.zeroSpeedIvs,
                isAlpha: false,
                specie: x.species,
                item: x.heldItem,
                lvl: x.lvl,
                abi: x.ability,
                ivs: [],
                evs: x.evs,
                hpType: x.hpType,
                nature: x.nature,
                moves: x.moves
            }}))
        }
      
    },
    trainers: function (r: Reader): void {
        const obj = r.parseCObj()
        const keys = Object.keys(obj)
        r.deactivateStateUntilTrans()
        for (const key of keys){
            const tData = obj[key]
            try{
                r.data.set(key, {
                    partyFlags: strOrArrayToArrayFilter(tData.partyFlags, ["|"]) || [],
                    trainerClass: tData.trainerClass || "",
                    trainerPic: tData.trainerPic|| "",
                    name: tData.trainerName|| "",
                    NAME: key.replace("TRAINER_", ""),
                    items: [],
                    AI: strOrArrayToArrayFilter(tData.aiFlags, ["|"]) || [],
                    party: ptrParties.get(tData.party?.ItemCustomMoves || "") || [],
                    double: strAsBool(tData.doubleBattle) || false,
                    elite: ptrParties.get(tData.partyInsane?.ItemCustomMoves || ""),
                    eliteDouble: false, //never used partySizeInsaneDouble
                })
                console.log(r.data.get(key))
            } catch(e){
                logError(`ER21, grabber of trainers, trainers ${key}: ${e}`)
            }
        }
    },
    battle_setup_await: function (r: Reader): void {
        
    },
    battle_setup: function (r: Reader): void {
        if (r.checkPattern("REMATCH", "(")){
            const rematches = r.multiTokenPattern("(", ")")
        }
    }
}
const cInject = `
#define _(A) A 
`
const filesSeparator = "__END_OF_FILE__"
const transitionsMap: Record<TemplateState, [string, TemplateState] | [string]>= {
    trainer_parties: [filesSeparator, "trainers"],
    trainers: [filesSeparator, "battle_setup_await"],
    battle_setup_await: ["gRematchTable", "battle_setup"],
    battle_setup: [";"]
}

const templateFileNest = [
    "src/data/trainer_parties.h",
    "src/data/trainers.h",
    "!src/battle_setup.c",[
        "#include/constants/opponents.h"
    ]
]

export function getER21Trainers(precursor: PProcessorData, finalCb: (t: ER21TrainerMap)=>void){
    cPreprocessFileNest2(extendNestedFilePathWithProjectPath(templateFileNest, projectPath), precursor, cInject, filesSeparator)
    .then((filedata)=>{
        const template = reader(filedata.str)
        finalCb(template)
    })
    .catch((err)=>{
        logWarn(err)
    })
}

function reader(fileData: string){
    const reader = new TokenReader<TemplateState, ER21TrainerMap>({
        tokens: tokenize(fileData),
        stateRec: XStateMap,
        startState: "trainer_parties",
        data: new Map(),
        transRec: transitionsMap,
        name: "template - name"
    })
    return reader.start()
}