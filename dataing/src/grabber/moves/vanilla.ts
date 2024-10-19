import { cPreprocessFileNest2, PProcessorData } from "../../extractor/preprocessor"
import { tokenize } from "../../extractor/tokenizer"
import { extendNestedFilePathWithProjectPath } from "../../extractor/parse_utils"
import { projectPath } from "../../config_handler"
import { logError, logInform } from "../../logging"
import { TokenReader} from "../token_reader"
import { resolveBoolean, resolveNumber } from "../utils"
import { initMoveVanilla, MoveVanilla, MoveFlagsVanilla } from "./move"


let move = initMoveVanilla()

type VanillaMoveDatas = MoveVanilla[]
type Reader = TokenReader<State, VanillaMoveDatas>
type State = "AwaitBegin" | "Moves" 

const XStateMap: Record<State, (reader: Reader)=>void> = {
    AwaitBegin: (reader: Reader) => {
        if (reader.tokenToState("gMovesInfo", "Moves")){
            reader.pushCursor(3)
        }
    },
    Moves: (r: Reader): void => {
        if (r.checkToken(";")){
            if (move.NAME){
                r.data.push(move)
            }
        }
        if (r.checkPattern("[", undefined, "]")){
            if (move.NAME){
                r.data.push(move)
            }
            move = initMoveVanilla()
            move.NAME = r.getToken(1)
            const data = r.parseC()
            move.name = data.name
            move.description = data.description
            move.effect = data.effect
            move.type = data.type
            move.category = data.category
            move.power = resolveNumber(data.power)
            move.acc = resolveNumber(data.accuracy)
            move.target = data.target
            move.pp = resolveNumber(data.pp)
            move.zmove = data.zMove
            move.prio = resolveNumber(data.priority)
            move.strikeCount = resolveNumber(data.strikeCount)
            move.criticalStage = resolveNumber(data.criticalHitStage)
            move.alwaysCrit = resolveBoolean(data.alwaysCriticalHit)
            move.additionnalEffect = data.additionalEffects
            move.argument = data.argument
            move.flags =  {
                contact: resolveBoolean(data.makesContact),
                ignoreProtect: resolveBoolean(data.ignoresProtect),
                magicCoat: resolveBoolean(data.magicCoatAffected),
                snatch: resolveBoolean(data.snatchAffected),
                kingsrock: resolveBoolean(data.ignoresKingsRock),
                punch: resolveBoolean(data.punchingMove),
                bitting: resolveBoolean(data.bitingMove),
                pulse: resolveBoolean(data.pulseMove),
                sound: resolveBoolean(data.soundMove),
                balistic: resolveBoolean(data.ballisticMove),
                powder: resolveBoolean(data.powderMove),
                dance: resolveBoolean(data.danceMove),
                wind: resolveBoolean(data.windMove),
                slice: resolveBoolean(data.slicingMove),
                heal: resolveBoolean(data.healingMove),
                minimizedDamage: resolveBoolean(data.minimizeDoubleDamage),
                ignoreAbility: resolveBoolean(data.ignoresTargetAbility),
                ignoreEvasion: resolveBoolean(data.ignoresTargetDefenseEvasionStages),
                damageUnderground: resolveBoolean(data.damagesUnderground),
                damageUnderwater: resolveBoolean(data.damagesUnderwater),
                damageAirborn: resolveBoolean(data.damagesAirborne),
                damageAirbornDouble: resolveBoolean(data.damagesAirborneDoubleDamage),
                ignoreFlyUngrounded: resolveBoolean(data.ignoreTypeIfFlyingAndUngrounded),
                thawsUser: resolveBoolean(data.thawsUser),
                ignoreSub: resolveBoolean(data.ignoresSubstitute),
                forcePressure: resolveBoolean(data.forcePressure),
                cantUseTwice: resolveBoolean(data.cantUseTwice),
            },
            move.ban = {
                gravity: resolveBoolean(data.gravityBanned),
                mirrorMove: resolveBoolean(data.mirrorMoveBanned),
                meFirst: resolveBoolean(data.meFirstBanned),
                mimic: resolveBoolean(data.mimicBanned),
                metronome: resolveBoolean(data.metronomeBanned),
                copycat: resolveBoolean(data.copycatBanned),
                assist: resolveBoolean(data.assistBanned),
                sleepTalk: resolveBoolean(data.sleepTalkBanned),
                instruct: resolveBoolean(data.instructBanned),
                encore: resolveBoolean(data.encoreBanned),
                parental: resolveBoolean(data.parentalBondBanned),
                skyBattle: resolveBoolean(data.skyBattleBanned),
                sketch: resolveBoolean(data.sketchBanned),
            }
        }
    }
}

const vanillaMovesFileNest = [
    "include/config/battle.h",[
        "src/data/moves_info.h",
    ]
    
]
const cInject = ``

export function getVanillaMoves(precursor: PProcessorData, finalCb: (data: VanillaMoveDatas)=>void){
    cPreprocessFileNest2(extendNestedFilePathWithProjectPath(vanillaMovesFileNest, projectPath), precursor, cInject)
    .then((fileData)=>{
        const data = reader(fileData.str)
        finalCb(data)
    })
    .catch((err)=>{
        logError("Getting Vanilla moves err: " + err)
    })
}

function reader(fileData: string){
    const tokens = tokenize(fileData)
    const reader = new TokenReader<State, VanillaMoveDatas>({
        tokens: tokens,//new Tokenizer(fileData, [], false).start(),
        stateRec: XStateMap,
        startState: "AwaitBegin",
        data: [],
        name: "moves - vanilla",
    })
    return reader.start()
}

