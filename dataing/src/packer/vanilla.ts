import { VanillaMoveData } from "../grabber/moves/move";
import { SpecieVanilla } from "../grabber/species/specie";
import { TrainerVanilla } from "../grabber/trainers/trainers";
import { CompactGamedata, CompactMove, CompactSpecie, CompactTrainer } from "./types";


export interface CompactGameDataVanilla extends CompactGamedata<CompactSpecie, CompactTrainer, CompactMove>{

}