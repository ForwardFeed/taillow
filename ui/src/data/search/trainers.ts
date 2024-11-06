import { findIndexesOfStringWithOperator, type FilterMap, type FilterOutput, type QueryOperators, type ReorderMap as ReorderMap } from "./search"
import type { CompactTrainer } from "@/stores/gamedata_type"

// the order of this also indicate the fuzzy search order
export const trainersFilterFields = ["name"] as const
export type TrainersFilterFields = (typeof trainersFilterFields)[number]

export const trainersFilterMap: FilterMap<TrainersFilterFields, CompactTrainer> = {
    name: function (data: CompactTrainer[], input: Lowercase<string>, operator: QueryOperators): FilterOutput {
        const indexes = findIndexesOfStringWithOperator(data.map(x => x.name.toLowerCase()), input, operator)
        return {
            indexes,
            suggestions: indexes.map(x => data[x].name)
        }
    },
}


export const trainersReorderFields = ["name"] as const
export type TrainersReorderFields = (typeof trainersReorderFields)[number]

export const trainersReorderMap: ReorderMap<TrainersReorderFields, CompactTrainer> = {
    name: function (data: CompactTrainer[]): number[] {
        return data.map((_x, i) => i).sort((a, b) => {
            return data[a].name.localeCompare(data[b].name)
        })
    },
}
