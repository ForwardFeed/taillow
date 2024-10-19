export interface BattleMonVanilla{
    specie: string,
    item: string,
    lvl: number,
    abi: string,
    ivs: number[],
    evs: number[],
    hpType: string,
    nature: string,
    moves: string[]
}

export interface TrainerVanilla {
    partyFlags: string[],
    trainerClass: string,
    trainerPic: string,
    name: string,
    NAME: string,
    items: string[]
    AI: string[],
    party: BattleMonVanilla[]
    double: boolean,
    rematch?: TrainerVanilla[]
}

export interface ER21BattleMon extends BattleMonVanilla{
    zeroSpeedIV?: boolean,
    isAlpha?: boolean,
}

// the type of the data you're parsing for [just refactor this name]
export interface ER21Trainer extends TrainerVanilla {
    elite?: BattleMonVanilla[]
    eliteDouble?: boolean,
}

export type Trainer = TrainerVanilla & Partial<ER21Trainer>

