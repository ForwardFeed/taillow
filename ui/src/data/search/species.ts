import type { DeepReadonly } from "vue"
import type { CompactSpecie } from "../../../../dataing/src/packer/species"
import { AisInB, type FilterMap, type ReorderMap as ReorderMap } from "./search"

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
    name: function (data: DeepReadonly<CompactSpecie[]>, input: Lowercase<string>): number[] {
        return data.map((specie, specieIndex) => {
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
    },
    ability: function (data: DeepReadonly<CompactSpecie>[], input: Lowercase<string>): number[] {
        throw new Error("Function not implemented.")
    },
    move: function (data: { readonly NAME: string; readonly name: string; readonly types: readonly number[]; readonly abilities: readonly number[]; readonly baseStats: readonly [HP: number, ATK: number, DEF: number, SPA: number, SPD: number, SPE: number]; readonly desc: string; readonly evos: readonly { readonly in: number; readonly val: string; readonly kind: number }[]; readonly prevEvo: readonly number[]; readonly mLevel: readonly { readonly lvl: number; readonly id: number }[]; readonly mTMHM: readonly number[]; readonly mTutors: readonly number[]; readonly mEggMoves: number | (number & number[]) | (number[] & number) | readonly number[]; readonly dims: readonly [height: number, weight: number]; readonly forms: readonly number[]; readonly internalID: number; readonly innates?: readonly number[] | undefined }[], input: Lowercase<string>): number[] {
        throw new Error("Function not implemented.")
    },
    type: function (data: { readonly NAME: string; readonly name: string; readonly types: readonly number[]; readonly abilities: readonly number[]; readonly baseStats: readonly [HP: number, ATK: number, DEF: number, SPA: number, SPD: number, SPE: number]; readonly desc: string; readonly evos: readonly { readonly in: number; readonly val: string; readonly kind: number }[]; readonly prevEvo: readonly number[]; readonly mLevel: readonly { readonly lvl: number; readonly id: number }[]; readonly mTMHM: readonly number[]; readonly mTutors: readonly number[]; readonly mEggMoves: number | (number & number[]) | (number[] & number) | readonly number[]; readonly dims: readonly [height: number, weight: number]; readonly forms: readonly number[]; readonly internalID: number; readonly innates?: readonly number[] | undefined }[], input: Lowercase<string>): number[] {
        throw new Error("Function not implemented.")
    }
}
