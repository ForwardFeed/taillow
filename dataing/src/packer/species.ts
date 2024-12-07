import { GameData } from "../grabber/gamedata"
import { tablize, Xtox } from "./utils"

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

export interface CompactSpecieER25 extends CompactSpecieVanilla{
    innates: number[]
}

export type CompactSpecie = CompactSpecieVanilla & Partial<CompactSpecieER25>

export function compactSpecies(gamedata: GameData, abisT: string[], movesT: string[]): {
    species: CompactSpecie[],
    speciesT: string[],
    evoKindsT: string[]
    }{
    const species: CompactSpecie[] = []
    const speciesT: string[] = []
    const namesT: string[] = []
    const evoKindsT: string[] = []
    // building first the species table because the evolution fields needs it
    gamedata.species.forEach((val, key)=>{
        if (~speciesT.indexOf(key))
            return
        speciesT.push(key)
        // put its forms adjacently in the data
        val.forms.forEach(formKey => {
            if (~speciesT.indexOf(formKey))
                return
            // those are invalid species
            if (!gamedata.species.get(formKey))
                return console.error("invalid specie but added as a form", formKey)
            speciesT.push(formKey)
        })
    })
    // grabbing most of the data
    speciesT.forEach((NAME) => {
        const specie = gamedata.species.get(NAME)
        if (!specie) // pretty bad news HUH
            return //console.error("WTF? ", NAME)
        const bs = specie.baseStats
        species.push({
            NAME: specie.NAME.replace(/^SPECIES_/, ''),
            name: ((name, NAME)=>{
                // because megas are the same names as the non-megas 
                // Or some forms share the same name
                if (namesT.includes(name)) {
                    name = Xtox('SPECIES_', NAME)
                }
                namesT.push(name)
                return name
            })(specie.name, specie.NAME),
            types: specie.types.map(x => gamedata.types.indexOf(x)),
            abilities: specie.abilities.map((x, i) => {
                // because it result stuff like [265, -1, -1] else
                let index = abisT.indexOf(x)
                let j = 1
                while(!~index){
                    index = abisT.indexOf(specie.abilities[i - j])
                    if (i - j < 0)
                        break
                    j++
                }
                return index
            }),
            innates: specie.innates?.map((x, i) => {
                // because it result stuff like [265, -1, -1] else
                let index = abisT.indexOf(x)
                let j = 1
                while(!~index){
                    index = abisT.indexOf(specie.innates?.[i - j] as string)
                    if (i - j < 0)
                        break
                    j++
                }
                return index
            }),
            baseStats: [bs.hp, bs.atk, bs.def, bs.spa, bs.spd, bs.spe],
            desc: specie.description,
            evos: specie.evolutions.map(x => {
                return {
                    in: tablize(speciesT, x.into),
                    val: x.value,
                    kind: tablize(evoKindsT, x.kind)
                } satisfies CompactEvolution
            }),
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
    species.forEach((specie, index) => {
        for (const evo of specie.evos){
            const nextEvo = species[evo.in]
            if (!nextEvo){
                return
            }
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
    verifyData(species)
    return {
        species, speciesT, evoKindsT
    }
}

function verifyData(data: CompactSpecie[]){
    if (!data.length)
        throw "No species were packed"
}