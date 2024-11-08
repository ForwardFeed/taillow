import { gamedata } from "@/stores/gamedata"
import { findIndexesOfStringWithOperator, findIndexOfNumericalWithOperators, type FilterMap, type FilterOutput, type QueryOperators, type ReorderMap as ReorderMap } from "./search"
import type { CompactMove } from "@/stores/gamedata_type"

// the order of this also indicate the fuzzy search order
export const movesFilterFields = ["name", "type", "power", "acc", "priority", "flags", "category" ,"description"] as const
export type MovesFilterFields = (typeof movesFilterFields)[number]

export const movesFilterMap: FilterMap<MovesFilterFields, CompactMove> = {
    name: function (data: CompactMove[], input: Lowercase<string>, operator: QueryOperators) {
        const indexes = findIndexesOfStringWithOperator(data.map(x => x.name.toLowerCase()), input, operator)
        return {
            indexes,
            suggestions: indexes.map(x => data[x].name)
        }
    },
    type: function (data: CompactMove[], input: Lowercase<string>): FilterOutput {
        const matchingTypes = findIndexesOfStringWithOperator(gamedata.value.types.map(x => x.toLowerCase()), input, "==")
        const indexes = data.reduce((acc, move, index)=>{
            if (~matchingTypes.indexOf(move.type)){
                acc.push(index)
                return acc
            }
            if (move.type2 && ~matchingTypes.indexOf(move.type2)){
                acc.push(index)
                return acc
            }
            return acc
        }, [] as number[])
        return {
            indexes,
            suggestions: matchingTypes.map(x => gamedata.value.types[x].toLowerCase())
        }
    },
    power: function (data: CompactMove[], input: Lowercase<string>, operator: QueryOperators): FilterOutput {
        const indexes = findIndexOfNumericalWithOperators(data.map(x => x.power), input, operator)
        return {
            indexes,
            suggestions: []
        }
    },
    acc: function (data: CompactMove[], input: Lowercase<string>, operator: QueryOperators): FilterOutput {
        const indexes = findIndexOfNumericalWithOperators(data.map(x => x.acc), input, operator)
        return {
            indexes,
            suggestions: []
        }
    },
    priority: function (data: CompactMove[], input: Lowercase<string>, operator: QueryOperators): FilterOutput {
        const indexes = findIndexOfNumericalWithOperators(data.map(x => x.prio), input, operator)
        return {
            indexes,
            suggestions: []
        }
    },
    category: function (data: CompactMove[], input: Lowercase<string>, operator: QueryOperators): FilterOutput {
        const indexes = findIndexOfNumericalWithOperators(data.map(x => x.prio), input, operator)
        return {
            indexes,
            suggestions: []
        }
    },
    flags: function (data: CompactMove[], input: Lowercase<string>): FilterOutput {
        const validFlags = findIndexesOfStringWithOperator(gamedata.value.moveFlagsT.map(x => x.toLowerCase()), input, "==")
        const validFlagsBan = findIndexesOfStringWithOperator(gamedata.value.moveFlagsBanT.map(x => x.toLowerCase()), input, "==")
        const suggestions = [] as string[]
        const indexes = data.reduce((acc, curr, index) => {
            const flagIndex = curr.flags.find(x => ~validFlags.indexOf(x))
            if (flagIndex){
                suggestions.push(gamedata.value.moveFlagsT[flagIndex])
                acc.push(index)
            }
            const flagBanIndex = curr.ban.find(x => ~validFlagsBan.indexOf(x))
            if (flagBanIndex){
                suggestions.push(gamedata.value.moveFlagsBanT[flagBanIndex])
                acc.push(index)
            }
            return acc
        }, [] as number[])
        return {
            indexes,
            suggestions,
        }
    },
    description: function (data: CompactMove[], input: Lowercase<string>, operator: QueryOperators): FilterOutput {
        const indexes = findIndexesOfStringWithOperator(data.map(x => x.description.toLowerCase()), input, operator)
        return {
            indexes,
            suggestions: indexes.map(x => data[x].name)
        }
    },
}

// this order indicate the order of the row too
export const movesReorderFields = ["name", "power", "acc", "prio", "type", "category", "chance", "critStage", "strikeCount", "pp"] as const
export type MovesReorderFields = (typeof movesReorderFields)[number]


export const movesReorderMap: ReorderMap<MovesReorderFields, CompactMove> = {
    name: function (data: CompactMove[]): number[] {
        return data.map((_x, i) => i).sort((a, b) => {
            return data[a].name.localeCompare(data[b].name)
        })
    },
    type: function (data: CompactMove[]): number[] {
        return data.map((_x, i) => i).sort((a, b) => {
            return data[a].type - data[b].type
        })
    },
    power: function (data: CompactMove[]): number[] {
        return data.map((_x, i) => i).sort((a, b) => {
            return data[a].power - data[b].power
        })
    },
    acc: function (data: CompactMove[]): number[] {
        return data.map((_x, i) => i).sort((a, b) => {
            return data[a].acc - data[b].acc
        })
    },
    prio: function (data: CompactMove[]): number[] {
        return data.map((_x, i) => i).sort((a, b) => {
            return data[a].prio - data[b].prio
        })
    },
    category: function (data: CompactMove[]): number[] {
        return data.map((_x, i) => i).sort((a, b) => {
            return data[a].category - data[b].category
        })
    },
    chance: function (data: CompactMove[]): number[] {
        return data.map((_x, i) => i).sort((a, b) => {
            return data[a].chance - data[b].chance
        })
    },
    critStage: function (data: CompactMove[]): number[] {
        return data.map((_x, i) => i).sort((a, b) => {
            return data[a].criticalStage - data[b].criticalStage
        })
    },
    strikeCount: function (data: CompactMove[]): number[] {
        return data.map((_x, i) => i).sort((a, b) => {
            return data[a].strikeCount - data[b].strikeCount
        })
    },
    pp: function (data: CompactMove[]): number[] {
        return data.map((_x, i) => i).sort((a, b) => {
            return data[a].pp - data[b].pp
        })
    }
}
