import { findIndexesOfStringWithOperator, type FilterMap, type FilterOutput, type QueryOperators, type ReorderMap as ReorderMap } from "./search"
import type { CompactSpecie } from "@/stores/gamedata_type"
import { gamedata } from "@/stores/gamedata"
import { findEggmoves } from "@/utils/poke_utils"

// the order of this also indicate the fuzzy search order
export const speciesSearchFields = ["name", "type", "ability", "move"] as const
export type SpeciesSearchFields = (typeof speciesSearchFields)[number]

export const speciesReorderMap: ReorderMap<SpeciesSearchFields, CompactSpecie> = {
    name: function (data: CompactSpecie[]): number[] {
        return data.map((_x, i) => i).sort((a, b) => {
            return data[a].name.localeCompare(data[b].name)
        })
    },
    ability: undefined,
    move: undefined,
    type: function (data: CompactSpecie[]): number[] {
        return data.map((_x, i) => i).sort((a, b) => {
            if (data[a].types[0] == data[b].types[0]){
                if (data[a].types[1] == data[b].types[1]){
                    return a > b ? 1 : -1
                }
                return data[a].types[1] > data[b].types[1] ? 1 : -1
            }
            return data[a].types[0] > data[b].types[0] ? 1 : -1
            
        })
    },
}

export const speciesFilterMap: FilterMap<SpeciesSearchFields, CompactSpecie> = {
    name: function (data: CompactSpecie[], input: Lowercase<string>, operator: QueryOperators) {
        const indexes = findIndexesOfStringWithOperator(data.map(x => x.name.toLowerCase()), input, operator)
        return {
            indexes,
            suggestions: indexes.map(x => data[x].name)
        }
    },
    ability: function (data: CompactSpecie[], input: Lowercase<string>): FilterOutput {
        // here == is to force the ability name to match completely
        const matchingAbis = findIndexesOfStringWithOperator(gamedata.value.abilities.map(x => x.name.toLowerCase()), input, "==")
        const indexes = data.map((specie, specieIndex) => {
            return ~ (specie.abilities.concat(specie.innates).find(x => ~matchingAbis.indexOf(x)) || -1) ? specieIndex : -1
        }).filter(x => ~x)
        return {
            indexes,
            suggestions: matchingAbis.map(x => gamedata.value.abilities[x].name)
        }
    },
    move: function (data: CompactSpecie[], input: Lowercase<string>): FilterOutput {
        // here == is to force the move name to match completely
        const matchingMoves = findIndexesOfStringWithOperator(gamedata.value.moves.map(x => x.name.toLowerCase()), input, "==")
        const indexes = data.reduce((acc, specie, index)=>{
            if (specie.mTMHM.find(x => ~matchingMoves.indexOf(x))){
                acc.push(index)
                return acc
            }
            if (specie.mTutors.find(x => ~matchingMoves.indexOf(x))){
                acc.push(index)
                return acc
            }
            if (findEggmoves(gamedata.value.species, specie.mEggMoves).find(x => ~matchingMoves.indexOf(x))){
                acc.push(index)
                return acc
            }
            if (specie.mLevel.map(x => x.id).find(x => ~matchingMoves.indexOf(x))){
                acc.push(index)
                return acc
            }
            return acc
        }, [] as number[])
        return {
            indexes,
            suggestions: matchingMoves.map(x => gamedata.value.moves[x].name)
        }
    },
    type: function (data: CompactSpecie[], input: Lowercase<string>): FilterOutput {
        const matchingTypes = findIndexesOfStringWithOperator(gamedata.value.types.map(x => x.toLowerCase()), input, "==")
        const indexes = data.map((specie, specieIndex) => {
            return ~ (specie.types.find(x => ~matchingTypes.indexOf(x)) || -1) ? specieIndex : -1
        }).filter(x => ~x)
        return {
            indexes,
            suggestions: matchingTypes.map(x => gamedata.value.types[x].toLowerCase())
        }
    }
}

