import { GameData } from "../grabber/gamedata/gamedata";
import { BattleMon, EVS, IVS, Trainer } from "../grabber/trainers/trainers";
import { tablize } from "./utils";



export interface CompactBattleMonVanilla{
    specie: number,
    item: number,
    lvl: number,
    abi: number,
    ivs: IVS[],
    evs: EVS[],
    nature: number,
    moves: number[]
}

export interface CompactBattleMonER21 extends CompactBattleMonVanilla{
    hpType: number,
    zeroSpeedIV: boolean,
    isAlpha: boolean,
}

export type CompactBattleMon = CompactBattleMonVanilla & Partial<CompactBattleMonER21>

export interface CompactTrainerVanilla{
    partyFlags: number[],
    trainerClass: number,
    trainerPic: number,
    name: string,
    NAME: string,
    items: number[]
    AI: number[],
    party: CompactBattleMon[]
    double: boolean,
    rematch?: CompactTrainerVanilla[]
}

export interface CompactTrainerER21 extends CompactTrainerVanilla{
    elite?: CompactBattleMon[]
    eliteDouble?: boolean,
}

export type CompactTrainer = CompactTrainerVanilla & Partial<CompactTrainerER21>

function compactBattleMon(mon: BattleMon, speciesT: string[], items: string[], natures: string[], movesT: string[], types: string[]): CompactBattleMon{
    return {
        specie: speciesT.indexOf(mon.specie),
        item: items.indexOf(mon.item),
        lvl: mon.lvl,
        abi: mon.ability,
        ivs: mon.ivs,
        evs: mon.evs,
        nature: natures.indexOf(mon.nature),
        moves: mon.moves.map(x => movesT.indexOf(x)),

        //ER21
        hpType: mon.hpType ? types.indexOf(mon.hpType) : undefined,
        zeroSpeedIV: mon.zeroSpeedIV,
        isAlpha: mon.isAlpha,
    }

}



export function compactTrainer(gamedata: GameData, speciesT: string[],
items: string[], types: string[], natures: string[], movesT: string[]){
    const trainers: CompactTrainer[] = []
    const tPartyFlags: string[] = []
    const tClass: string[] = []
    const tPic: string[] = []
    const tAi: string[] = []
    function compactTrainerData(trainer: Trainer): CompactTrainer{
        const compactTrainer: CompactTrainer = {
            partyFlags: trainer.partyFlags.map(x => tablize(tPartyFlags, x)),
            trainerClass: tablize(tClass, trainer.trainerClass),
            trainerPic: tablize(tPic, trainer.trainerPic),
            name: trainer.name,
            NAME: trainer.NAME,
            items: trainer.items.map(x => items.indexOf(x)),
            AI: trainer.AI.map(x => tablize(tAi, x)),
            party: trainer.party.map(x => compactBattleMon(x, speciesT, items, natures, movesT, types)),
            double: trainer.double,
            rematch: trainer.rematch?.map(compactTrainerData),

            // ER21
            elite: trainer.elite?.map(x => compactBattleMon(x, speciesT, items, natures, movesT, types)),
            eliteDouble: trainer.eliteDouble,
        }
        return compactTrainer
    }

    gamedata.trainers.forEach((trainer)=>{
        trainers.push(compactTrainerData(trainer))
    })
}