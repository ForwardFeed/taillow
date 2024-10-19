import { GameData } from "../grabber/gamedata/gamedata";
import { compactAbilities, CompactAbility } from "./abilities";
import { CompactMove } from "./moves";
import { CompactSpecie } from "./species";
import { CompactTrainer } from "./trainers";

export interface CompactGameData{
    abilities: CompactAbility[],
    moves: CompactMove[],
    species: CompactSpecie[]
    trainers: CompactTrainer[],

    types: string[],
    natures: string[],
}

export function pack(gamedata: GameData): CompactGameData{
    const abis = compactAbilities(gamedata)
    return {
        abilities: abis.abis,
        moves: [],
        species: [],
        trainers: [],

        types: gamedata.natures,
        natures: gamedata.types
    }
}