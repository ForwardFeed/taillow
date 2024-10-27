import type { DeepReadonly } from "vue"
import type { CompactSpecie } from "../../../../dataing/src/packer/species"
import { AisInB, makeSuggestions, type FilterMap, type ReorderMap as ReorderMap } from "./search"

export const speciesFilterFields = ["name", "ability", "move", "type"] as const
export type SpeciesFilderFields = (typeof speciesFilterFields)[number]

export const specieReorderFields = ["name"] as const satisfies readonly SpeciesFilderFields[]
export type SpeciesReorderFields = (typeof specieReorderFields)[number] 

export const speciesReorderMap: ReorderMap<SpeciesReorderFields, DeepReadonly<CompactSpecie>> = {
    name: function (data: DeepReadonly<CompactSpecie>[]): number[] {
        return data.map((_x, i)=> i).sort((a, b)=>{
            return data[a].name.localeCompare(data[b].name)
        })
    },
}

export const speciesFilterMap: FilterMap<SpeciesFilderFields, DeepReadonly<CompactSpecie>> = {
    name: function (data: DeepReadonly<CompactSpecie[]>, input: Lowercase<string>){
        const indexes =  data.map((specie, specieIndex) => {
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
            //@ts-ignore fuck you
            suggestions: makeSuggestions(data, "name") 
        }
    },
    ability: function (data: DeepReadonly<CompactSpecie>[], input: Lowercase<string>) {
        throw new Error("Function not implemented.")
    },
    move: function (data: DeepReadonly<CompactSpecie>[], input: Lowercase<string>) {
        throw new Error("Function not implemented.")
    },
    type: function (data: DeepReadonly<CompactSpecie>[], input: Lowercase<string>) {
        throw new Error("Function not implemented.")
    }
}
