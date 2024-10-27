import { GameData } from "../grabber/gamedata"

export interface CompactAbilityVanilla{
    name: string,
    desc: string,
    internalID: number,
}


export type CompactAbility = CompactAbilityVanilla


export function compactAbilities(gamedata: GameData): {abis: CompactAbility[], abisT: string[]}{
    const abisT: string[] = []
    const abis: CompactAbilityVanilla[] = []
    gamedata.abilities.forEach((val, key)=>{
        abisT.push(key)
        abis.push({
            name: val.name,
            desc: val.desc,
            internalID: val.internalID
        })
    })
    verifyData(abis)
    return {abis, abisT}
}


function verifyData(abis: CompactAbility[]){
    if(!abis.length)
        throw "No Abilities were packed"
}