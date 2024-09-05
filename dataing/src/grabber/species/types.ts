export type BaseStats = {
    hp   : number,
    atk  : number,
    def  : number,
    spa  : number,
    spd  : number,
    spe  : number,
}

export type Evolution = {
    kind: string,
    value: string,
    into: string
}

export type LevelUpMove = {
    lvl: string,
    move: string
}
export function initLevelUpMove(){
    return []
}
export interface SpecieData {
    NAME: string
    name: string
    types: string[]
    abilities: string[]
    baseStats: BaseStats
    description: string,
    evolutions: Evolution[]
    levelupMoves: LevelUpMove[]
    tmhm: string[]
    tutors: string[]
    eggmoves: string[]
    dimensions: {
        height: number,
        weight: number
    }
    forms: string[]
}

export interface ErSpecieData extends SpecieData{
    innates: string[]
    internalID: number
}

export function initSpecieData(): SpecieData{
    return {
        NAME: "",
        name: "",
        types: [],
        abilities: [],
        baseStats: {
            hp   : 0,
            atk  : 0,
            def  : 0,
            spa  : 0,
            spd  : 0,
            spe  : 0,
        },
        description: "",
        evolutions: [],
        levelupMoves: initLevelUpMove(),
        tmhm: [],
        tutors: [],
        eggmoves: [],
        dimensions: {height: 0, weight: 0},
        forms: []
    }
}

export function initERSpecieData(): ErSpecieData{
    return {
        ...initSpecieData(),
        innates: [],
        internalID: 0
    }
}