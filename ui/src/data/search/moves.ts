import { gamedata } from "@/stores/gamedata"
import { AisInB, findIndexesOfStringWithOperator, findIndexOfNumericalWithOperators, type FilterMap, type FilterOutput, type QueryOperators, type ReorderMap as ReorderMap } from "./search"
import type { CompactMove } from "@/stores/gamedata_type"

// the order of this also indicate the fuzzy search order
export const movesSearchFields = ["name", "type", "power", "acc", "priority", "flags", "category" ,"description"] as const
export type MovesSearchFields = (typeof movesSearchFields)[number]

export const movesFilterMap: FilterMap<MovesSearchFields, CompactMove> = {
    name: function (data: CompactMove[], input: Lowercase<string>, operator: QueryOperators) {
        const indexes = findIndexesOfStringWithOperator(data.map(x => x.name.toLowerCase()), input, operator)
        return {
            indexes,
            suggestions: indexes.map(x => data[x].name)
        }
    },
    type: function (data: CompactMove[], input: Lowercase<string>, operator: QueryOperators): FilterOutput {
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

export const movesReorderFields = ["name", "type", "power", "acc", "prio"] as const
export type MovesReorderFields = (typeof movesReorderFields)[number]


export const movesReorderMap: ReorderMap<MovesReorderFields, CompactMove> = {
    name: function (data: CompactMove[]): number[] {
        return data.map((_x, i) => i).sort((a, b) => {
            return data[a].name.localeCompare(data[b].name)
        })
    },
    type: function (data: CompactMove[]): number[] {
        return data.map((_x, i) => i).sort((a, b) => {
            const xa = data[a].type
            const xb = data[b].type
            return xa == xb ? 0 : xa > xb ? 1 : -1
        })
    },
    power: function (data: CompactMove[]): number[] {
        return data.map((_x, i) => i).sort((a, b) => {
            const xa = data[a].power
            const xb = data[b].power
            return xa == xb ? 0 : xa > xb ? 1 : -1
        })
    },
    acc: function (data: CompactMove[]): number[] {
        return data.map((_x, i) => i).sort((a, b) => {
            const xa = data[a].acc
            const xb = data[b].acc
            return xa == xb ? 0 : xa > xb ? 1 : -1
        })
    },
    prio: function (data: CompactMove[]): number[] {
        return data.map((_x, i) => i).sort((a, b) => {
            const xa = data[a].prio
            const xb = data[b].prio
            return xa == xb ? 0 : xa > xb ? 1 : -1
        })
    },
}
