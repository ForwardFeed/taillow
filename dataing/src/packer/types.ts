import { AbilityData } from "../grabber/abilities/types"

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
    abilities: AbilityData[]
    trainers: Trainers[]
    moves: Moves[]
    
    // indexes
    types: string[] //fetch this from include/constants/pokemon.h #define TYPE_
    items: string[] //
    natures: string[] //fetch this from include/constants/pokemon.h #define NATURE_

    trainerClass: string[],
    trainerPic: string[],
    TrainerAIs: string[]
}
