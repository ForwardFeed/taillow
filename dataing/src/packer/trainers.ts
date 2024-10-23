import { GameData } from "../grabber/gamedata/gamedata";
import { BattleMon, EVS, IVS, Trainer } from "../grabber/trainers/trainers";
import { logWarn } from "../logging";
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

export interface CompactBattleMonER25 extends CompactBattleMonVanilla{
    hpType: number,
    zeroSpeedIV: boolean,
    isAlpha: boolean,
}

export type CompactBattleMon = CompactBattleMonVanilla & Partial<CompactBattleMonER25>

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

export interface CompactTrainerER25 extends CompactTrainerVanilla{
    elite?: CompactBattleMon[]
    eliteDouble?: boolean,
}

export type CompactTrainer = CompactTrainerVanilla & Partial<CompactTrainerER25>

function compactBattleMon(mon: BattleMon, speciesT: string[], items: string[], natures: string[], movesT: string[], types: string[]): CompactBattleMon{
    return {
        specie: speciesT.indexOf(mon.specie),
        item: items.indexOf(mon.item),
        lvl: mon.lvl,
        abi: mon.ability,
        ivs: mon.ivs,
        evs: mon.evs,
        nature: natures.indexOf(mon.nature),
        moves: mon.moves?.map(x => movesT.indexOf(x)) || [],

        //ER25
        hpType: mon.hpType ? types.indexOf(mon.hpType) : undefined,
        zeroSpeedIV: mon.zeroSpeedIV,
        isAlpha: mon.isAlpha,
    }

}

export function compactTrainers(gamedata: GameData, speciesT: string[], movesT: string[]){
    const trainers: CompactTrainer[] = []
    const trainersT: string[] = []
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
            items: trainer.items.map(x => gamedata.items.indexOf(x)),
            AI: trainer.AI.map(x => tablize(tAi, x)),
            party: trainer.party.map(x => compactBattleMon(x, speciesT, gamedata.items, gamedata.natures, movesT, gamedata.types)),
            double: trainer.double,
            rematch: trainer.rematch?.map(compactTrainerData),

            // ER25
            elite: trainer.elite?.map(x => compactBattleMon(x, speciesT, gamedata.items, gamedata.natures, movesT, gamedata.types)),
            eliteDouble: trainer.eliteDouble,
        }
        return compactTrainer
    }

    gamedata.trainers.forEach((trainer, NAME)=>{
        try{
            trainersT.push(NAME)
            trainers.push(compactTrainerData(trainer))
        } catch(e){
            logWarn(`packing trainer: failed to grab trainer ${JSON.stringify(trainer)}, reason: ${e}`)
        }
        
    })
    verifyData(trainers)
    return {
        trainers: trainers,
        trainersT: trainersT,
        tPartyFlags: tPartyFlags,
        tClass: tClass,
        tPic: tPic,
        tAi: tAi
    }
}

function verifyData(trainers: CompactTrainer[]){
    if (!trainers.length)
        throw "No trainers were packed"
}