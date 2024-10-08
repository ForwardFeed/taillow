import type { BuilderSettingsData } from "./settings_builder"
import type { CalcSettingsData } from "./settings_calc"
import type { DexSettingsData } from "./settings_dex"
import type { GeneralSettingsData } from "./settings_general"
import type { ThemeSettingsData } from "./settings_theme"

export type SettingsStore = {
    general : GeneralSettingsData, 
    theme   : ThemeSettingsData,
    dex     : DexSettingsData,
    builder : BuilderSettingsData,
    calc    : CalcSettingsData 
}