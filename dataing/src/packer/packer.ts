import { GameData } from "../grabber/gamedata";
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
    worldMaps: CompactWorldMap[]

    moveFlagsT: string[],
    moveFlagsBanT: string[],
    //moveEffectT: string[],
    moveCategoryT: string[],

    trainerClasses: string[],

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
        worldMaps: maps,

        moveFlagsT: moves.moveFlagsT,
        moveFlagsBanT: moves.moveFlagsBanT,
        //moveEffectT: moves.moveEffectT,
        moveCategoryT: moves.moveCategory,

        trainerClasses: trainers.tClass,

        types: gamedata.types.map(x => x.replace(/^TYPE_/, '')).filter(x => x),
        natures: gamedata.natures.map(x => x.replace(/^NATURE_/, '')),
        items: gamedata.items.map(x => x.replace(/^ITEM_/, '')),

        encounterFields: gamedata.worldMaps.encounterFields
    }
}