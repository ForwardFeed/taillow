import type { KeysEnum } from "@/utils/types"

// rip poor's language man `${RGBAValue},${RGBAValue},${RGBAValue},${number}`

export type ThemeData = {
    color1: string
    color2: string
}

export type ThemeDataKeys = {
    name: string,
    tooltip?: string,
    variable: string
}

export const enumThemeData: KeysEnum<ThemeData, ThemeDataKeys> = {
    color1: {
        name: "Color 1",
        variable: "main-button-P",
    },
    color2: {
        name: "Color 2",
        variable: "main-button-A",
    }
}

export const presetList = ["a", "b", "custom"] as const
export type PresetList = (typeof presetList)[number]

export const defaultThemePresets: Record<PresetList, ThemeData> = {
    a: {
        color1: "rgba(255,255,0,1)",
        color2: "rgba(255,0,0,1)",
    },
    b: {
        color1: "rgba(255,0,0,1)",
        color2: "rgba(255,255,0,1)",
    },
    custom: {
        color1: "rgba(255,255,0,1)",
        color2: "rgba(255,0,0,1)",
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


export function changeGlobalCssVariables(theme: ThemeData){
    const keys = Object.keys(enumThemeData) as Array<keyof typeof enumThemeData>
    for (const key of keys){
        const themeData = enumThemeData[key]
        document.documentElement.style.setProperty(`--${themeData.variable}`, theme[key])
    }
}