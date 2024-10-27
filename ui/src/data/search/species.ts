import type { CompactSpecie } from "../../../../dataing/src/packer/species"
import { AisInB, type FilterMap, type ReorderMap as ReorderMap } from "./search"

const speciesSearchFields = ["name", "ability", "move", "type"] as const
type SpeciesSearchFields = (typeof speciesSearchFields)[number]

const specieReorderFields = ["name"] as const satisfies readonly SpeciesSearchFields[]
type SpeciesReorderFields = (typeof specieReorderFields)[number] 

export const speciesReorderMap: ReorderMap<SpeciesReorderFields, CompactSpecie> = {
    name: function (data: CompactSpecie[]): number[] {
        return data.map((_x, i)=> i).sort((a, b)=>{
            return data[a].name.localeCompare(data[b].name)
        })
    },
}

function saap(data: CompactSpecie[]){
    return data.filter(x => x.name)
}

export const speciesFilterMap: FilterMap<SpeciesSearchFields, CompactSpecie> = {
    name: function (data: CompactSpecie[], input: Lowercase<string>): number[] {
        return data.map((specie, specieIndex) => {
            const splitedInput = input.split(' ')
            if (!splitedInput.length) return -1
            for (const word of splitedInput){
                let hasSlicedMatched = false
                for (const splice of specie.name.split(' ')){
                    hasSlicedMatched = AisInB(word, splice) || hasSlicedMatched
                }
                if (!hasSlicedMatched) return -1
            }
            return specieIndex
            }).filter(x => ~x)
    },
    ability: function (data: CompactSpecie[], input: Lowercase<string>): number[] {
        throw new Error("Function not implemented.")
    },
    move: function (data: CompactSpecie[], input: Lowercase<string>): number[] {
        throw new Error("Function not implemented.")
    },
    type: function (data: CompactSpecie[], input: Lowercase<string>): number[] {
        throw new Error("Function not implemented.")
    }
}