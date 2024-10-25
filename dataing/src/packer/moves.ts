import { GameData } from "../grabber/gamedata";
import { tablize } from "./utils";

export interface CompactMoveVanilla {
    NAME: string,
    name: string,
    description: string,
    //effect: number,
    type: number,
    category: number,
    power: number,
    pp: number,
    // zmove: {effect: string, power: number},
    prio: number,
    strikeCount: number,
    criticalStage: number
    additionnalEffect: number[],
    flags: number[],
    ban: number[],
    argument: string,
}

interface CompactMoveER1 extends CompactMoveVanilla {
    type2: number,
    chance: number,
    splitFlag: string[],
}

export type CompactMove = CompactMoveVanilla & Partial<CompactMoveER1>


export function compactMoves(gamedata: GameData):
    {moves: CompactMove[], movesT: string[], moveFlagsT: string[],
    moveFlagsBanT: string[], moveEffectT: string[], moveCategory: string[] } {
    const moves: CompactMove[] = []
    const movesT: string[] = []
    const moveFlagsT: string[] = []
    const moveFlagsBanT: string[] = []
    const moveEffectT: string[] = []
    const moveCategory: string[] = []
    gamedata.moves.forEach((val, key)=>{
        movesT.push(key)
        moves.push({
            NAME: val.NAME,
            name: val.name,
            description: val.description,
            //effect: tablize(moveEffectT, val.effect),
            type: tablize(gamedata.types, val.type),
            type2: tablize(gamedata.types, val.type2),
            category: tablize(moveCategory, val.category),
            power: val.power,
            pp: val.pp,
            prio: val.prio,
            strikeCount: val.strikeCount,
            criticalStage: val.criticalStage,
            additionnalEffect: val.additionnalEffect.map(x => tablize(moveEffectT, x)),
            flags: Object.keys(val.flags)
                //@ts-ignore
                .filter(x => val.flags[x])
                .map( x => tablize(moveFlagsT, x)),
            ban: Object.keys(val.ban)
                //@ts-ignore
                .filter(x => val.ban[x])
                .map( x => tablize(moveFlagsBanT, x)),
            argument: val.argument,
            chance: val.chance || 0,
            splitFlag: val.splitFlag,
        })
    })
    verifyData(moves)
    return {moves, movesT, moveFlagsT, moveFlagsBanT, moveEffectT, moveCategory}
}

function verifyData(moves: CompactMove[]){
    if (!moves.length)
        throw "No moves were packed"
}