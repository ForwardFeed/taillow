import { GameData } from "../grabber/gamedata/gamedata";
import { compactAbilities, CompactAbility } from "./abilities";
import { compactMoves, CompactMove, } from "./moves";
import { CompactSpecie, compactSpecies } from "./species";
import { compactTrainers, CompactTrainer } from "./trainers";

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
    items: string[],
}

export function pack(gamedata: GameData): CompactGameData{
    const abis = compactAbilities(gamedata)
    const moves = compactMoves(gamedata)
    const species  = compactSpecies(gamedata, abis.abisT, moves.movesT)
    const trainers = compactTrainers(gamedata, species.speciesT, moves.movesT)
    const maps = ""

    return {
        abilities: abis.abis,
        moves: moves.moves,
        species: species.species,
        trainers: trainers.trainers,

        moveFlagsT: moves.moveFlagsT,
        moveFlagsBanT: moves.moveFlagsBanT,
        moveEffectT: moves.moveEffectT,
        moveCategory: moves.moveFlagsBanT,

        types: gamedata.natures,
        natures: gamedata.types,
        items: [], // TODO
    }
}