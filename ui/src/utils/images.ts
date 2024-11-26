import { config } from "../../../config"
import { cConstToStringName } from "./poke_utils"

export function getSpecieSprite(specieName: string, imageIndex = 0): string{
    return `${config.base}/sprites/${specieName}${[
        "",
        "_BACK",
        "_SHINY",
        "_BACK_SHINY"
    ][imageIndex % 4]}.png`
}

export  function encounterFieldToIconName(enc: string):string{
    return `${config.base}/icons/${{
        "land_mons": "grass",
        "water_mons": "water",
        "rock_smash_mons": "rocksmash",
        "fishing_mons": "fishe",
        "honey_mons": "honey",
        "hidden_mons": "hidden"
    }[enc] || cConstToStringName(enc)}.png`
}