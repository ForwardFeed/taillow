import { gamedata } from "@/stores/gamedata"
import { AisInB, findIndexesOfString, type FilterMap, type FilterOutput, type ReorderMap as ReorderMap } from "./search"
import type { CompactMove } from "@/stores/gamedata_type"

// the order of this also indicate the fuzzy search order
export const movesSearchFields = ["name", "type", "power", "acc", "priority", "flags", "category" ,"description"] as const
export type MovesSearchFields = (typeof movesSearchFields)[number]

export const movesReorderMap: ReorderMap<MovesSearchFields, CompactMove> = {
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
    priority: function (data: CompactMove[]): number[] {
        return data.map((_x, i) => i).sort((a, b) => {
            const xa = data[a].prio
            const xb = data[b].prio
            return xa == xb ? 0 : xa > xb ? 1 : -1
        })
    },
    category: undefined,
    flags: undefined,
    description: undefined,
}

export const movesFilterMap: FilterMap<MovesSearchFields, CompactMove> = {
    name: function (data: CompactMove[], input: Lowercase<string>) {
        const indexes = data.map((x, i) => {
            return AisInB(input, x.name.toLowerCase()) ? i : -1
        }).filter(x => ~x)
        return {
            indexes,
            suggestions: indexes.map(x => data[x].name)
        }
    },
    type: function (data: CompactMove[], input: Lowercase<string>): FilterOutput {
        const validTypes = gamedata.value.types.reduce((acc, curr, index) => {
            if (AisInB(input, curr.toLowerCase()))
                acc.push(index)
            return acc
        }, [] as number[])
        const indexes = data.reduce((acc, curr, index) => {
            if (~validTypes.indexOf(curr.type))
                acc.push(index)
            return acc
        }, [] as number[])
        return {
            indexes,
            suggestions: validTypes.map(x => gamedata.value.types[x].toLowerCase())
        }
    },
    power: function (data: CompactMove[], input: Lowercase<string>): FilterOutput {
        const indexes = data.reduce((acc, curr, index) => {
            if (~validTypes.indexOf(curr.type))
                acc.push(index)
            return acc
        }, [] as number[])
        return {
            indexes,
            suggestions: []
        }
    },
    acc: function (data: CompactMove[], input: Lowercase<string>): FilterOutput {
        throw new Error("Function not implemented.")
    },
    priority: function (data: CompactMove[], input: Lowercase<string>): FilterOutput {
        throw new Error("Function not implemented.")
    },
    category: function (data: CompactMove[], input: Lowercase<string>): FilterOutput {
        const validCats = findIndexesOfString(gamedata.value.moveCategoryT, input)
    },
    flags: function (data: CompactMove[], input: Lowercase<string>): FilterOutput {
        const validFlags = gamedata.value.moveFlagsT.reduce((acc, curr, index) => {
            if (AisInB(input, curr.toLowerCase()))
                acc.push(index)
            return acc
        }, [] as number[])
        const validFlagsBan = gamedata.value.moveFlagsBanT.reduce((acc, curr, index) => {
            if (AisInB(input, curr.toLowerCase()))
                acc.push(index)
            return acc
        }, [] as number[])
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
    description: function (data: CompactMove[], input: Lowercase<string>): FilterOutput {
        const indexes = data.map((x, i) => {
            return AisInB(input, x.description.toLowerCase()) ? i : -1
        }).filter(x => ~x)
        return {
            indexes,
            suggestions: indexes.map(x => data[x].name)
        }
    },
}

