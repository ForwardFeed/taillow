import type { KeysEnum } from "@/utils/types"

export type RGBA = `${number},${number},${number},${number}`

export type ThemeData = {
    color1: RGBA
    color2: RGBA
}

export const keysEnumThemeData: KeysEnum<ThemeData> = {
    color1: true,
    color2: true
}



export const presetList = ["a", "b",] as const
export type PresetList = (typeof presetList)[number]

export const defaultThemePresets: Record<PresetList, ThemeData> = {
    a: {
        color1: "255,255,0,1",
        color2: "0,255,255,1",
    },
    b: {
        color1: "0,255,255,1",
        color2: "255,255,0,1",
    }
}

export interface ThemeSettingsData {
    current: ThemeData
    preset: PresetList
    custom: ThemeData
}

export const defaultThemeSettings: ThemeSettingsData = {
    preset: "a",
    current: defaultThemePresets.a,
    custom: defaultThemePresets.a
}