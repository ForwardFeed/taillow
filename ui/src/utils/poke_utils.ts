import type { CompactSpecie } from "@/stores/gamedata_type"

/**
 * The idea is that eggmoves can be a number which is a specie ID that has the eggmoves in question
 */

export function findEggmoves(species: CompactSpecie[],eggmoves: Readonly<number | number[]>, preventRecurse=false): readonly number[]{
    if (typeof eggmoves === "object")
        return eggmoves
    if (preventRecurse)
        return []
    return findEggmoves(species, species[eggmoves].mEggMoves, true)
}