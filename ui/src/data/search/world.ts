import { findIndexesOfStringWithOperator, type FilterMap, type FilterOutput, type QueryOperators, type ReorderMap as ReorderMap } from "./search"
import type { CompactWorldMap } from "@/stores/gamedata_type"

// the order of this also indicate the fuzzy search order
export const worldFilterFields = ["name"] as const
export type WorldFilterFields = (typeof worldFilterFields)[number]

export const worldFilterMap: FilterMap<WorldFilterFields, CompactWorldMap> = {
    name: function (data: CompactWorldMap[], input: Lowercase<string>, operator: QueryOperators):FilterOutput {
        const indexes = findIndexesOfStringWithOperator(data.map(x => x.name.toLowerCase()), input, operator)
        return {
            indexes,
            suggestions: indexes.map(x => data[x].name)
        }
    }
}


export const worldReorderFields = ["name"] as const
export type WorldReorderFields = (typeof worldReorderFields)[number]

export const worldReorderMap: ReorderMap<WorldReorderFields, CompactWorldMap> = {
    name: function (data: CompactWorldMap[]): number[] {
        return data.map((_x, i) => i).sort((a, b) => {
            return data[a].name.localeCompare(data[b].name)
        })
    },
}
