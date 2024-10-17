import { PProcessorData, cPreprocessFileNest2 } from "../../extractor/preprocessor"
import { tokenize } from "../../extractor/tokenizer"
import { extendNestedFilePathWithProjectPath } from "../../extractor/parse_utils"
import { projectPath } from "../../config_handler"
import { logWarn } from "../../logging"
import { TokenReader} from "../token_reader"
import { BattleMon, TrainerData } from "./trainers"
import { on } from "events"

export interface ER21BattleMon extends BattleMon{
    zeroSpeedIV?: boolean,
    isAlpha?: boolean,
}

// the type of the data you're parsing for [just refactor this name]
export interface ER21Trainer extends TrainerData {
    elite?: BattleMon[]
    eliteDouble?: boolean,
}
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
            r.deactivateStateUntilTrans()
        }
      
    },
    trainers: function (r: Reader): void {
        console.log(r.parseCObj())
        return
        while(r.getNextToken() && r.checkToken(";")){
            let TNAME = ""
            if (r.checkToken("[")){
                while(r.getNextToken() && !r.checkToken("]"))
                    TNAME += r.token
            } else {
                continue
            }
            console.log(TNAME)
            break
            const tData = r.parseCObj()
            r.data.set(TNAME, {
                partyFlags: tData.partyFlags?.filter((x: string) => x !== "|") || [],
                trainerClass: tData.trainerClass?.join() || "",
                trainerPic: tData.trainerPic?.join() || "",
                name: tData.trainerName?.join() || "",
                NAME: TNAME.replace("TRAINER_", ""),
                items: [],
                AI: tData.aiFlags?.filter((x: string) => x !== "|") || [],
                party: tData.party?.ItemCustomMoves?.[0], // TODO
                double: tData.doubleBattle?.join() || "",
                elite: tData.partyInsane?.ItemCustomMoves?.[0] || undefined, //TODO
                eliteDouble: false, //neverused partySizeInsaneDouble
            })
            console.log(tData, TNAME)
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
