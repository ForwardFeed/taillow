import { GameData } from "../grabber/gamedata/gamedata"
import { tablize } from "./utils"

//                   
export type CompactBaseStats = [HP: number, ATK: number, DEF: number, SPA: number, SPD: number, SPE: number]

export type CompactEvolution = {
    in: number,
    val: string,
    kind: number,
}

export type CompactLevelUpMove = {
    lvl: number,
    id: number
}

export interface CompactSpecieVanilla{
    NAME: string,
    name: string,
    types: number[],
    abilities: number[],
    baseStats: CompactBaseStats,
    desc: string,
    evos: CompactEvolution[],
    // list of direct pre-evos
    prevEvo: number[],
    mLevel: CompactLevelUpMove[],
    mTMHM: number[],
    mTutors: number[],
    //list of moves, of the id of the pokemon that knows the moves
    mEggMoves: number[] | number, 
    dims: [height: number, weight: number],
    forms: number[],
    internalID: number
}

export interface CompactSpecieER21 extends CompactSpecieVanilla{
    innates: number[]
}

export type CompactSpecie = CompactSpecieVanilla & Partial<CompactSpecieER21>

export function compactSpecies(gamedata: GameData, abisT: string[], movesT: string[]): {
    species: CompactSpecie[],
    speciesT: string[]
    }{
    const species: CompactSpecie[] = []
    const speciesT: string[] = []

    // building first the species table because the evolution fields needs it
    gamedata.species.forEach((val, key)=>{
        speciesT.push(key)
    })
    // grabbing most of the data
    speciesT.map((NAME) => {
        const specie = gamedata.species.get(NAME)
        if (!specie)
            return
        const bs = specie.baseStats
        species.push({
            NAME: specie.NAME,
            name: specie.name,
            types: specie.types.map(x => gamedata.types.indexOf(x)),
            abilities: specie.abilities.map(x => abisT.indexOf(x)),
            innates: specie.innates?.map(x => abisT.indexOf(x)),
            baseStats: [bs.hp, bs.atk, bs.def, bs.spa, bs.spd, bs.spe],
            desc: specie.description,
            evos: [],
            prevEvo: [],
            mLevel: specie.levelupMoves.map( x => {return {
                lvl: +x.lvl,
                id: movesT.indexOf(x.move)
            }}),
            mTMHM: specie.tmhm.map(x => movesT.indexOf(x)),
            mTutors: specie.tutors.map(x => movesT.indexOf(x)),
            mEggMoves: specie.eggmoves.map(x => movesT.indexOf(x)),
            dims: [specie.dimensions.height, specie.dimensions.weight],
            forms: [],
            internalID: specie.internalID,
        })
    })
    // feeding pre-evos data and eggmoves index
    species.map((specie, index) => {
        for (const evo of specie.evos){
            const nextEvo = species[evo.in]
            nextEvo.prevEvo.push(index)
            if (specie.mEggMoves){
                if (typeof specie.mEggMoves === "number"){
                    nextEvo.mEggMoves = specie.mEggMoves
                } else {
                    nextEvo.mEggMoves = index
                }
                
            }
        }
        if (specie.mEggMoves){

        }
    })
    return {
        species, speciesT
    }
}