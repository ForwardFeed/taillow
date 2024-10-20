import { GameData } from "../grabber/gamedata/gamedata";

export interface CompactTrainerVanilla{

}

export interface CompactTrainerER21{

}

export type CompactTrainer = CompactTrainerVanilla & Partial<CompactTrainerER21>

export function compactTrainer(gamedata: GameData, speciesT: string[]){
    const trainers: CompactTrainer[] = []
    
    gamedata.trainers.forEach((val, key)=>{

    })
}