import { AisInB, makeSuggestions, type FilterMap, type FilterOutput, type ReorderMap as ReorderMap } from "./search"
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
    type: undefined
}

export const speciesFilterMap: FilterMap<SpeciesSearchFields, CompactSpecie> = {
    name: function (data: CompactSpecie[], input: Lowercase<string>) {
        const indexes = data.map((specie, specieIndex) => {
            const splitedInput = input.split(' ')
            if (!splitedInput.length) return -1
            for (const word of splitedInput) {
                let hasSlicedMatched = false
                for (const splice of specie.name.split(' ')) {
                    hasSlicedMatched = AisInB(word, splice.toLowerCase()) || hasSlicedMatched
                }
                if (!hasSlicedMatched) return -1
            }
            return specieIndex
        }).filter(x => ~x)
        return {
            indexes,
            suggestions: makeSuggestions(data, indexes, "name")
        }
    },
    ability: function (data: CompactSpecie[], input: Lowercase<string>): FilterOutput {
        const matchingAbis = gamedata.value.abilities.reduce(function(filtered, ability, index){
            if (AisInB(input, ability.name.toLowerCase())){
                filtered.push(index)
            }
            return filtered
        }, [] as number[])
        const indexes = data.map((specie, specieIndex) => {
            return ~ (specie.abilities.concat(specie.innates).find(x => ~matchingAbis.indexOf(x)) || -1) ? specieIndex : -1
        }).filter(x => ~x)
        return {
            indexes,
            suggestions: makeSuggestions(gamedata.value.abilities, matchingAbis, "name")
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
            suggestions: makeSuggestions(gamedata.value.moves, matchingMoves, "name")
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
            suggestions: matchingTypes.map(x => gamedata.value.types[x].toLowerCase()).slice(0, 8)
        }
    }
}

