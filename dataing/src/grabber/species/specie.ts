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
export interface SpecieVanilla {
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
    internalID: number
}

export interface SpecieER25 extends SpecieVanilla{
    innates: string[]
}

export function initSpecieData(): SpecieVanilla{
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
        forms: [],
        internalID: 0
    }
}

export function initERSpecieData(): SpecieER25{
    return {
        ...initSpecieData(),
        innates: [],
    }
}


export type Specie = SpecieVanilla & Partial<SpecieER25>