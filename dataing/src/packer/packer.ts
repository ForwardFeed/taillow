import { GameData } from "../grabber/gamedata/gamedata";
import { compactAbilities, CompactAbility } from "./abilities";
import { compactMoves, CompactMove, } from "./moves";
import { CompactSpecie, compactSpecies } from "./species";
import { compactTrainers, CompactTrainer } from "./trainers";
import { CompactWorldMap, compactWorldMaps } from "./world_map";

export interface CompactGameData{
    abilities: CompactAbility[],
    moves: CompactMove[],
    species: CompactSpecie[]
    trainers: CompactTrainer[],
    maps: CompactWorldMap[]

    moveFlagsT: string[],
    moveFlagsBanT: string[],
    moveEffectT: string[],
    moveCategory: string[],

    types: string[],
    natures: string[],
    items: string[],

    encounterFields: string[]
}

export function pack(gamedata: GameData): CompactGameData{
    const abis = compactAbilities(gamedata)
    const moves = compactMoves(gamedata)
    const species  = compactSpecies(gamedata, abis.abisT, moves.movesT)
    const trainers = compactTrainers(gamedata, species.speciesT, moves.movesT)
    const maps = compactWorldMaps(gamedata.worldMaps.worldMapData, gamedata.worldMaps.encounterFields,species.speciesT)

    return {
        abilities: abis.abis,
        moves: moves.moves,
        species: species.species,
        trainers: trainers.trainers,
        maps: maps,

        moveFlagsT: moves.moveFlagsT,
        moveFlagsBanT: moves.moveFlagsBanT,
        moveEffectT: moves.moveEffectT,
        moveCategory: moves.moveFlagsBanT,

        types: gamedata.types.map(x => x.replace(/^TYPE_/, '')),
        natures: gamedata.natures.map(x => x.replace(/^NATURE_/, '')),
        items: gamedata.items.map(x => x.replace(/^ITEM_/, '')),

        encounterFields: gamedata.worldMaps.encounterFields
    }
}