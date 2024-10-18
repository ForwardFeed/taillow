import { VanillaMoveData } from "../grabber/moves/types";
import { SpecieData } from "../grabber/species/types";
import { TrainerData } from "../grabber/trainers/trainers";
import { CompactGamedata, CompactMove, CompactSpecie, CompactTrainer } from "./types";


export interface CompactGameDataVanilla extends CompactGamedata<CompactSpecie, CompactTrainer, CompactMove>{

}