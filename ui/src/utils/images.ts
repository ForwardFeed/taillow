import { cConstToStringName } from "./poke_utils"

export function getSpecieImage(specieName: string, imageIndex = 0): string{
    return [
        `/img/${specieName}.png`,
        `/img/${specieName}_BACK.png`,
        `/img/${specieName}_SHINY.png`,
        `/img/${specieName}_BACK_SHINY.png`,
    ][imageIndex% 4]
}

export  function encounterFieldToIconName(enc: string):string{
    return `/icons/${{
        "land_mons": "grass",
        "water_mons": "water",
        "rock_smash_mons": "rocksmash",
        "fishing_mons": "fishe",
        "honey_mons": "honey",
        "hidden_mons": "hidden"
    }[enc] || cConstToStringName(enc)}.png`
}