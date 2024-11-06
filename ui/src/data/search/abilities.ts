import { AisInB, type FilterMap, type FilterOutput, type ReorderMap as ReorderMap } from "./search"
import type { CompactAbility } from "@/stores/gamedata_type"

// the order of this also indicate the fuzzy search order
export const abilitiesSearchFields = ["name", "description"] as const
export type AbilitiesSearchFields = (typeof abilitiesSearchFields)[number]

export const abilitiesFilterMap: FilterMap<AbilitiesSearchFields, CompactAbility> = {
    name: function (data: CompactAbility[], input: Lowercase<string>) {
        const indexes = data.map((x, i) => {
            return AisInB(input, x.name.toLowerCase()) ? i : -1
        }).filter(x => ~x)
        return {
            indexes,
            suggestions: indexes.map(x => data[x].name)
        }
    },
    description: function (data: CompactAbility[], input: Lowercase<string>): FilterOutput {
        const indexes = data.map((x, i) => {
            return AisInB(input, x.desc.toLowerCase()) ? i : -1
        }).filter(x => ~x)
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
