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

function toLowerButFirstCase(word: string): string {
    word = word.toLowerCase()
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function convertItemNames(word: string): string{
    return word.replace('ITEM_', '').split('_').map(toLowerButFirstCase).join(' ')
}
function convertMoveNames(word: string): string {
    return word.replace('MOVE_', '').split('_').map(toLowerButFirstCase).join(' ')
}
function convertSpeciesNames(word: string): string {
    return word.replace('SPECIES_', '').split('_').map(toLowerButFirstCase).join(' ')
}
function convertMapName(word: string): string {
    return word.replace('MAPSEC_', '').split('_').map(toLowerButFirstCase).join(' ')
}

export function evoKindToText(evoKindText: string, value: string): string{
    return {
        "EVO_LEVEL": `Evolves at level: ${value}`,
        "EVO_MEGA_EVOLUTION": `Mega-evolves with ${convertItemNames(value)}`,
        "EVO_ITEM": `Evolves with ${convertItemNames(value)}`,
        "EVO_MOVE": `Evolves with ${convertMoveNames(value)}`,
        "EVO_LEVEL_ATK_LT_DEF": `Evolves if Atk < def`,
        "EVO_LEVEL_ATK_GT_DEF": `Evolves if Atk > def`,
        "EVO_LEVEL_ATK_EQ_DEF": `Evolves if Atk = def`,
        "EVO_LEVEL_SILCOON": "???",
        "EVO_LEVEL_CASCOON": "???",
        "EVO_PRIMAL_REVERSION": "???",
        "EVO_ITEM_MALE": `Evolves with ${convertItemNames(value)}`,
        "EVO_ITEM_FEMALE": `Evolves with ${convertItemNames(value)}`,
        "EVO_LEVEL_NINJASK": "???",
        "EVO_LEVEL_SHEDINJA": "???",
        "EVO_MOVE_MEGA_EVOLUTION": `Mega-evolves with ${convertMoveNames(value)}`,
        "EVO_LEVEL_FEMALE": `Evolves at level: ${value} if female`,
        "EVO_LEVEL_MALE": `Evolves at level: ${value} if male`,
        "EVO_SPECIFIC_MON_IN_PARTY": `Evolves if ${convertSpeciesNames(value)} is in party`,
        "EVO_LEVEL_NIGHT": `Evolves at night if level ${value}`,
        "EVO_LEVEL_DUSK": `Evolves at dusk if level ${value}`,
        "EVO_LEVEL_DAY": `Evolves at day if level ${value}`,
        "EVO_SPECIFIC_MAPSEC": `Evolves when level up at ${convertMapName(value)}`
    }[evoKindText] || evoKindText.split('_').map(toLowerButFirstCase).join(' ')
}