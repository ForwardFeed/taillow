import { GameData } from "../grabber/gamedata/gamedata";
import { compactAbilities, CompactAbility } from "./abilities";
import { compactMoves, CompactMove, } from "./moves";
import { CompactSpecie, compactSpecies } from "./species";
import { CompactTrainer } from "./trainers";

export interface CompactGameData{
    abilities: CompactAbility[],
    moves: CompactMove[],
    species: CompactSpecie[]
    trainers: CompactTrainer[],

    moveFlagsT: string[],
    moveFlagsBanT: string[],
    moveEffectT: string[],
    moveCategory: string[],

    types: string[],
    natures: string[],
}

export function pack(gamedata: GameData): CompactGameData{
    const abis = compactAbilities(gamedata)
    const moves = compactMoves(gamedata)
    const species  = compactSpecies(gamedata, abis.abisT, moves.movesT)
    return {
        abilities: abis.abis,
        moves: moves.moves,
        species: species.species,
        trainers: [],

        moveFlagsT: moves.moveFlagsT,
        moveFlagsBanT: moves.moveFlagsBanT,
        moveEffectT: moves.moveEffectT,
        moveCategory: moves.moveFlagsBanT,

        types: gamedata.natures,
        natures: gamedata.types
    }
}