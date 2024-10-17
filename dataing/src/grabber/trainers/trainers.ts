export interface BattleMon{
    NAME: string,
    item: string,
    lvl: number,
    abi: string,
    ivs: number[],
    evs: number[],
    hpType: number[],
    nature: string,
    moves: string[]
}

export interface TrainerData {
    partyFlags: string,
    trainerClass: string,
    trainerPic: string,
    name: string,
    NAME: string,
    items: string[]
    AI: string,
    party: BattleMon[]
    double: boolean,
    rematch?: TrainerData[]
}

