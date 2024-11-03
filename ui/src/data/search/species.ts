import { AisInB, findIndexesOfString, type FilterMap, type FilterOutput, type ReorderMap as ReorderMap } from "./search"
import type { CompactSpecie } from "@/stores/gamedata_type"
import { gamedata } from "@/stores/gamedata"

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
    name: function (data: CompactSpecie[], input: Lowercase<string>) {
        const indexes = data.map((specie, specieIndex) => {
            return AisInB(input, specie.name) ? specieIndex : -1
        }).filter(x => ~x)
        return {
            indexes,
            suggestions: indexes.map(x => data[x].name)
        }
    },
    ability: function (data: CompactSpecie[], input: Lowercase<string>): FilterOutput {
        const matchingAbis = findIndexesOfString(gamedata.value.abilities.map(x => x.name.toLowerCase()), input)
        const indexes = data.map((specie, specieIndex) => {
            return ~ (specie.abilities.concat(specie.innates).find(x => ~matchingAbis.indexOf(x)) || -1) ? specieIndex : -1
        }).filter(x => ~x)
        return {
            indexes,
            suggestions: matchingAbis.map(x => gamedata.value.abilities[x].name)
        }
    },
    move: function (data: CompactSpecie[], input: Lowercase<string>): FilterOutput {
        const matchingMoves = gamedata.value.moves.reduce(function(filtered, move, index){
            if (AisInB(input, move.name.toLowerCase())){
                filtered.push(index)
            }
            return filtered
        }, [] as number[])
        const indexes = data.map((specie, specieIndex) => {
            const allmoves = specie.mTMHM.concat(specie.mEggMoves, specie.mTutors, specie.mLevel.map(x => x.id))
            return ~ (allmoves.find(x => ~matchingMoves.indexOf(x)) || -1) ? specieIndex : -1
        }).filter(x => ~x)
        return {
            indexes,
            suggestions: matchingMoves.map(x => gamedata.value.moves[x].name)
        }
    },
    type: function (data: CompactSpecie[], input: Lowercase<string>): FilterOutput {
        const splited = input.trim().split(' ')
        const matchingTypes = gamedata.value.types.reduce(function(filtered, type, index){
            for (const split of splited){
                if (AisInB(split,type.toLowerCase() ) && !~filtered.indexOf(index)){
                    filtered.push(index)
                }
            }
            return filtered
        }, [] as number[])
        const indexes = data.map((specie, specieIndex) => {
            return ~ (specie.types.find(x => ~matchingTypes.indexOf(x)) || -1) ? specieIndex : -1
        }).filter(x => ~x)
        return {
            indexes,
            suggestions: matchingTypes.map(x => gamedata.value.types[x].toLowerCase())
        }
    }
}

