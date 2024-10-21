import { Ability } from "../abilities/ability"
import { Move } from "../moves/move"
import { Specie } from "../species/specie"
import { Trainer } from "../trainers/trainers"


export interface GameData {
    species: Map<string, Specie>
    abilities: Map<string, Ability>
    trainers: Map<string, Trainer>
    moves: Map<string, Move>

    types: string[]
    items: string[]
    natures: string[]
}
