/* manual reconstitution of the data structure because we cannot have THAT amount of nice things
* Also putting everything in readonly so it's **CLEAR**
* Using deepReadonly caused me sooo much annoying issues, like being force to type DeepReadonly
* Everywere or just being unable to get rid of the goofy aaah lint error
* + I can't run type-check datating folder because it has been made much more losely than the UI here
*/


export type CompactAbility = {
    readonly name: string,
    readonly desc: string,
    readonly internalID: number,
}

export type CompactMove = {
    readonly NAME: string,
    readonly name: string,
    readonly description: string,
    //effect: number,
    readonly type: number,
    readonly category: number,
    readonly power: number,
    readonly pp: number,
    // zmove: {effect: string, power: number},
    readonly prio: number,
    readonly strikeCount: number,
    readonly criticalStage: number
    readonly additionnalEffect: number[],
    readonly flags: number[],
    readonly ban: number[],
    readonly argument: string,

    // ER25
    readonly type2: number,
    readonly chance: number,
    readonly splitFlag: string[],
}

export type CompactBaseStats = [HP: number, ATK: number, DEF: number, SPA: number, SPD: number, SPE: number]

export type CompactEvolution = {
    readonly in: number,
    readonly val: string,
    readonly kind: number,
}

export type CompactLevelUpMove = {
    readonly lvl: number,
    readonly id: number
}

export type CompactSpecie = {
    readonly NAME: string,
    readonly name: string,
    readonly types: number[],
    readonly abilities: number[],
    readonly baseStats: CompactBaseStats,
    readonly desc: string,
    readonly evos: CompactEvolution[],
    // list of direct pre-evos
    readonly prevEvo: number[],
    readonly mLevel: CompactLevelUpMove[],
    readonly mTMHM: number[],
    readonly mTutors: number[],
    //list of moves, of the id of the pokemon that knows the moves
    readonly mEggMoves: number[] | number, 
    readonly dims: [height: number, weight: number],
    readonly forms: number[],
    readonly internalID: number

    // ER
    readonly  innates: number[]
}

export type IVS = [HP: number, ATK: number, DEF: number, SPA: number, SPD: number, SPE: number]
export type EVS = [HP: number, ATK: number, DEF: number, SPA: number, SPD: number, SPE: number]


export type CompactBattleMon = {
    readonly specie: number,
    readonly item: number,
    readonly lvl: number,
    readonly abi: number,
    readonly ivs: IVS[],
    readonly evs: EVS[],
    readonly nature: number,
    readonly moves: number[],

    // ER
    readonly hpType: number,
    readonly zeroSpeedIV: boolean,
    readonly isAlpha: boolean,
}

export type CompactTrainer = {
    readonly partyFlags: number[],
    readonly trainerClass: number,
    readonly trainerPic: number,
    readonly name: string,
    readonly NAME: string,
    readonly items: number[]
    readonly AI: number[],
    readonly party: CompactBattleMon[]
    readonly double: boolean,
    readonly rematch?: CompactTrainer[]
    // ER

    readonly elite?: CompactBattleMon[]
    readonly eliteDouble?: boolean,
}



export type CompactEncounterField = {
    readonly encounters_rate: number,
    readonly mons: {
        readonly min_level: number, 
        readonly max_level: number,
        readonly specie:number
    }[]
}

export type CompactWorldMap = {
    readonly name: string,
    /*dims: {
        w: number,
        h: number
    },*/
    readonly encounters: (CompactEncounterField | undefined)[],
    //objsEv: CompactObjectEventVanilla[],
}


export interface CompactGameData  {
    readonly abilities: CompactAbility[],
    readonly moves: CompactMove[],
    readonly species: CompactSpecie[]
    readonly trainers: CompactTrainer[],
    readonly maps: CompactWorldMap[]

    readonly moveFlagsT: string[],
    readonly moveFlagsBanT: string[],
    //moveEffectT: string[],
    readonly moveCategory: string[],

    readonly types: string[],
    readonly natures: string[],
    readonly items: string[],

    readonly encounterFields: string[]
}