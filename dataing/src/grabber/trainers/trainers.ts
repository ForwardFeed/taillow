export type IVS = [HP: number, ATK: number, DEF: number, SPA: number, SPD: number, SPE: number]
export type EVS = [HP: number, ATK: number, DEF: number, SPA: number, SPD: number, SPE: number]

export interface BattleMonVanilla{
    specie: string,
    item: string,
    lvl: number,
    ability: number,
    ivs: IVS[],
    evs: EVS[],
    nature: string,
    moves: string[]
}

export interface ER25BattleMon extends BattleMonVanilla{
    hpType: string,
    zeroSpeedIV?: boolean,
    isAlpha?: boolean,
}


export type BattleMon = BattleMonVanilla & Partial<ER25BattleMon>

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


// the type of the data you're parsing for [just refactor this name]
export interface ER25Trainer extends TrainerVanilla {
    elite?: BattleMonVanilla[]
    eliteDouble?: boolean,
}

export type Trainer = TrainerVanilla & Partial<ER25Trainer>

