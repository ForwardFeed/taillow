import { Ability } from "../grabber/abilities/ability"

export interface CompactMove{
    
}


export interface CompactSpecie{
    abilities: number[]
    name: string,
    NAME: string,
}

export interface CompactBattleMon{
    specie: number,
    item: number,
    lvl: number,
    abi: number,
    ivs: number[],
    evs: number[],
    hpType: number,
    nature: number,
    moves: number[]
}

export interface CompactTrainer{
    partyFlags: string[],
    trainerClass: number,
    trainerPic: number,
    name: string,
    NAME: string,
    items: number[]
    AI: number[],
    party: CompactBattleMon[]
    double: boolean,
    rematch?: CompactTrainer[]
}


export interface CompactGamedata<
    Species extends CompactSpecie,
    Trainers extends CompactTrainer,
    Moves extends CompactMove>{
    species: Species[]
    abilities: Ability[]
    trainers: Trainers[]
    moves: Moves[]
    
    // indexes
    types: string[]
    items: string[]
    natures: string[]

    trainerClass: string[],
    trainerPic: string[],
    trainerAIs: string[]
}
