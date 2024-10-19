import { cPreprocessFileNest2, PProcessorData } from "../../extractor/preprocessor"
import { tokenize } from "../../extractor/tokenizer"
import { extendNestedFilePathWithProjectPath } from "../../extractor/parse_utils"
import { projectPath } from "../../config_handler"
import { logError } from "../../logging"
import { TokenReader} from "../token_reader"
import { resolveBoolean, resolveNumber, resolveString } from "../utils"
import { MoveER21, initMoveEr21 } from "./move"



type Moves = Map<string, MoveER21>
type Reader = TokenReader<TemplateState, Moves>
type TemplateState = "move_descriptions" | "move_descriptions2" | "move_names" | "battle_script_commands" | "sForbiddenMoves" | "sMoveEffectsForbiddenToInstruct" | "battle_moves" 

const descMap = new Map()
let forbiddenInstruct = [] as string[]
let forbiddenMovesFlags = {} as any;

const XStateMap: Record<TemplateState, (reader: Reader)=>void> = {
    battle_script_commands: (r: Reader): void => {
    },
    sForbiddenMoves: (r: Reader): void => {
        forbiddenMovesFlags = r.parseC()
       r.deactivateStateUntilTrans() 
    },
    sMoveEffectsForbiddenToInstruct: (r: Reader): void => {
        forbiddenInstruct = r.parseC()[0]
        r.deactivateStateUntilTrans() 
    },
    battle_moves: (reader: Reader) => {
        const obj = reader.parseC()
        const keys = Object.keys(obj)
        for (const NAME of keys){
            const move = obj[NAME]
            if (!move.flags) move.flags = []
            const forbidden = forbiddenMovesFlags[NAME] || []
            const effect = resolveString(move.effect)
            const argument = resolveString(move.argument)
            let strikeCount = 1
            if (~move.flags.indexOf('FLAG_TWO_STRIKES')){
                strikeCount = 2
            } else if (effect == "EFFECT_DOUBLE_HIT"){
                strikeCount = + argument
            } else if (effect == "EFFECT_TRIPLE_KICK"){
                strikeCount = 3
            }
            let recoil = 0
            if (effect == "EFFECT_RECOIL_25_STATUS" || effect == "EFFECT_RECOIL_HP_25" || effect == "EFFECT_RECOIL_25"){
                recoil = 0.25
            } else if (effect == "EFFECT_RECOIL_IF_MISS" || effect == "EFFECT_RECOIL_50" || effect == "EFFECT_FLINCH_RECOIL_50"){
                recoil = 0.5
            } else if (effect == "EFFECT_RECOIL_33" || effect == "EFFECT_RECOIL_33_STATUS" || effect == "EFFECT_FLINCH_RECOIL_33"){
                recoil = 0.33
            }
            const erMove: MoveER21 = {
                ...initMoveEr21(),
                NAME: NAME,
                effect: effect,
                category: resolveString(move.split),
                splitFlag: move.splitFlag,
                power: resolveNumber(move.power),
                type: resolveString(move.type),
                type2: resolveString(move.type2),
                acc: resolveNumber(move.accuracy),
                pp: resolveNumber(move.pp),
                prio: resolveNumber(move.priority),
                chance: resolveNumber(move.secondaryEffectChance),
                target: resolveString(move.target),
                criticalStage: +!!~move.flags.indexOf('FLAG_HIGH_CRIT'),
                strikeCount: strikeCount,
                argument: argument,
                recoil: recoil,
                flags: {
                    twoTurnMove: resolveBoolean(move.twoTurnMove),
                    arrowBased: resolveBoolean(move.arrowBased),
                    hornBased: resolveBoolean(move.hornBased),
                    airBased: resolveBoolean(move.airBased),
                    hammerBased: resolveBoolean(move.hammerBased),
                    throwingBased: resolveBoolean(move.throwingBased),
                    doubleDamageVsMega: resolveBoolean(move.doubleDamageVsMega),
                    contact: !!~move.flags.indexOf('FLAG_MAKES_CONTACT'),
                    ignoreProtect: !~move.flags.indexOf('FLAG_PROTECT_AFFECTED'),
                    magicCoat: !!~move.flags.indexOf('FLAG_MAGIC_COAT_AFFECTED'),
                    snatch: !!~move.flags.indexOf('FLAG_SNATCH_AFFECTED'),
                    kingsrock: !!~move.flags.indexOf('FLAG_KINGS_ROCK_AFFECTED'),
                    punch: !!~move.flags.indexOf('FLAG_IRON_FIST_BOOST'),
                    bitting: !!~move.flags.indexOf('FLAG_STRONG_JAW_BOOST'),
                    pulse: !!~move.flags.indexOf('FLAG_MEGA_LAUNCHER_BOOST'),
                    sound: !!~move.flags.indexOf('FLAG_SOUND'),
                    balistic: !!~move.flags.indexOf('FLAG_BALLISTIC'),
                    powder: !!~move.flags.indexOf('FLAG_POWDER'),
                    dance: !!~move.flags.indexOf('FLAG_DANCE'),
                    wind: false,
                    slice: !!~move.flags.indexOf('FLAG_KEEN_EDGE_BOOST'),
                    heal: false,
                    minimizedDamage: false,
                    ignoreAbility: !!~move.flags.indexOf('FLAG_TARGET_ABILITY_IGNORED'),
                    ignoreEvasion: false,
                    damageUnderground: !!~move.flags.indexOf('FLAG_DMG_UNDERGROUND'),
                    damageUnderwater: !!~move.flags.indexOf('FLAG_DMG_UNDERWATER'),
                    damageAirborn: !!~move.flags.indexOf('FLAG_DMG_IN_AIR'),
                    damageAirbornDouble: !!~move.flags.indexOf('FLAG_DMG_2X_IN_AIR'),
                    ignoreFlyUngrounded: !!~move.flags.indexOf('FLAG_DMG_UNGROUNDED_IGNORE_TYPE_IF_FLYING'),
                    thawsUser: !!~move.flags.indexOf('FLAG_THAW_USER'),
                    ignoreSub: !!~move.flags.indexOf('FLAG_HIT_IN_SUBSTITUTE'),
                    forcePressure: false,
                    cantUseTwice: false,
                    recklessBoost: !!~move.flags.indexOf('FLAG_RECKLESS_BOOST'),
                    sheerForceBoost: !!~move.flags.indexOf('FLAG_SHEER_FORCE_BOOST'),
                    statsChangeIgnored: !!~move.flags.indexOf('FLAG_STAT_STAGES_IGNORED'),
                    strickerBoost: !!~move.flags.indexOf('FLAG_STRIKER_BOOST'),
                    protection: !!~move.flags.indexOf('FLAG_PROTECTION_MOVE'),
                    BoneBased: !!~move.flags.indexOf('FLAG_BONE_BASED'),
                    weatherBased: !!~move.flags.indexOf('FLAG_WEATHER_BASED'),
                    fieldBased: !!~move.flags.indexOf('FLAG_FIELD_BASED'),
                    alwaysCrit: false
                },
                ban:{
                    gravity: false,
                    mirrorMove: !~move.flags.indexOf('FLAG_MIRROR_MOVE_AFFECTED'),
                    meFirst: false,
                    mimic: !!~forbidden.indexOf('FORBIDDEN_MIMIC'),
                    metronome: !!~forbidden.indexOf('FORBIDDEN_METRONOME'),
                    copycat: !!~forbidden.indexOf('FORBIDDEN_COPYCAT'),
                    assist: !!~forbidden.indexOf('FORBIDDEN_ASSIST'),
                    sleepTalk: !!~forbidden.indexOf('FORBIDDEN_SLEEP_TALK'),
                    instruct: !!~forbiddenInstruct.indexOf(effect),
                    encore: false,
                    parental: !!resolveBoolean(move.parentalBondBanned),
                    skyBattle: false,
                    sketch: false
                }
            }
            reader.data.set(NAME, erMove)
        }
        reader.deactivateStateUntilTrans()
    },
    move_descriptions: (r: Reader): void => {
        if (r.checkPattern('static', 'const', 'u8')){
            const pointer = r.getToken(3)
            const text = r.multiTokenPattern("(", ")")
            descMap.set(pointer, text.join(''))
        }
    },
    move_descriptions2: (r: Reader): void => {
        const obj = r.parseC()
        const keys = Object.keys(obj)
        for (const key of keys){
            const NAME = key.slice(0, key.length - 2)
            const move = r.data.get(NAME)
            if (!move)
                continue
            move.description = descMap.get(obj[key]?.[0])
        }
        r.deactivateStateUntilTrans()
    },
    move_names: (r: Reader): void => {
        const obj = r.parseC()
        const keys = Object.keys(obj)
        for (const NAME of keys){
            const move = r.data.get(NAME)
            if (!move)
                continue
            move.name = obj[NAME].slice(2, -1).join('')
        }
        r.deactivateStateUntilTrans()
    },
}
const cInject = `

`
const filesSeparator = "__END_OF_FILE__"
const transitionsRec: Record<TemplateState, [string, TemplateState] | [string]>= {
    battle_script_commands: ["sForbiddenMoves", "sForbiddenMoves"],
    sForbiddenMoves: ["sMoveEffectsForbiddenToInstruct", "sMoveEffectsForbiddenToInstruct"],
    sMoveEffectsForbiddenToInstruct: [filesSeparator, "battle_moves"],
    battle_moves: [filesSeparator, "move_descriptions"],
    move_descriptions: ["gMoveDescriptionPointers", "move_descriptions2"],
    move_descriptions2: [filesSeparator, "move_names"],
    move_names: [filesSeparator],
}
const templateFileNest = [
    "!src/battle_script_commands.c",
    "src/data/battle_moves.h",
    "src/data/text/move_descriptions.h",
    "src/data/text/move_names.h",[
        '#include/constants/moves.h'
    ]
]

export function getER21Moves(precursor: PProcessorData, finalCb: (data: Moves)=>void){
    cPreprocessFileNest2(extendNestedFilePathWithProjectPath(templateFileNest, projectPath), precursor, cInject, filesSeparator)
    .then((fileData)=>{
        const data = reader(fileData.str)
        data.forEach((val, key)=>{
            val.internalID = +(fileData.ppm.has(key) ? fileData.ppm.get(key)?.join() as string : -1)
        })
        finalCb(data)
    })
    .catch((err)=>{
        console.trace(err)
        logError("Getting ER21 Moves err: " + err)
    })
}

function reader(fileData: string){
    const reader = new TokenReader<TemplateState, Moves>({
        tokens: tokenize(fileData),
        stateRec: XStateMap,
        startState: "battle_script_commands",
        data: new Map(),
        transRec: transitionsRec,
        name: "moves - er2.1"
    })
    return reader.start()
}