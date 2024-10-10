import type { KeysEnum } from "@/utils/types"

// rip poor's language man `${RGBAValue},${RGBAValue},${RGBAValue},${number}`

export type ThemeData = {
    color1: string
    color2: string
}

export type ThemeDataKeys = {
    name: string,
    tooltip?: string,
}

export const keysEnumThemeData: KeysEnum<ThemeData, ThemeDataKeys> = {
    color1: {
        name: "Color 1",
    },
    color2: {
        name: "Color 2"
    }
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