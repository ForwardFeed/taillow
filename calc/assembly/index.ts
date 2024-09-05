import { SPECIES } from "./constants";

// The entry file of your WebAssembly module.

export function add(a: i32, b: i32): i32 {
    return a + b
}

export function specieB(): number{
    return SPECIES.B
}

interface SpecieT {
    id: number,
    hp: number,
    atk: number
}

class Specie implements SpecieT{
    id: number = 0;
    hp: number = 0;
    atk: number = 0;
}

export function calc(attacker: Specie, defender: Specie): number{
 return defender.hp - attacker.atk;
}