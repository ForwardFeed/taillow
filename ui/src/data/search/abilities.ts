import { findIndexesOfStringWithOperator, type FilterMap, type FilterOutput, type QueryOperators, type ReorderMap as ReorderMap } from "./search"
import type { CompactAbility } from "@/stores/gamedata_type"

// the order of this also indicate the fuzzy search order
export const abilitiesFilterFields = ["name", "description"] as const
export type AbilitiesFilterFields = (typeof abilitiesFilterFields)[number]

export const abilitiesFilterMap: FilterMap<AbilitiesFilterFields, CompactAbility> = {
    name: function (data: CompactAbility[], input: Lowercase<string>, operator: QueryOperators) {
        const indexes = findIndexesOfStringWithOperator(data.map(x => x.name.toLowerCase()), input, operator)
        return {
            indexes,
            suggestions: indexes.map(x => data[x].name)
        }
    },
    description: function (data: CompactAbility[], input: Lowercase<string>, operator: QueryOperators): FilterOutput {
        const indexes = findIndexesOfStringWithOperator(data.map(x => x.desc.toLowerCase()), input, operator)
        return {
            indexes,
            suggestions: indexes.map(x => data[x].name)
        }
    },
}


export const abilitiesReorderFields = ["name"] as const
export type AbilitiesReorderFields = (typeof abilitiesReorderFields)[number]

export const abilitiesReorderMap: ReorderMap<AbilitiesReorderFields, CompactAbility> = {
    name: function (data: CompactAbility[]): number[] {
        return data.map((_x, i) => i).sort((a, b) => {
            return data[a].name.localeCompare(data[b].name)
        })
    },
}
