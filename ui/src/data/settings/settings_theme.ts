import type { KeysEnum } from "@/utils/types"

// rip template litterals: type RGBA = `${RGBAValue},${RGBAValue},${RGBAValue},${number}`

export type ThemeData = {
    mainButtonPassive: string
    mainButtonActive: string
}

export type ThemeDataKeys = {
    name: string,
    tooltip?: string,
    variable: string
}

export const enumThemeData: KeysEnum<ThemeData, ThemeDataKeys> = {
    mainButtonPassive: {
        name: "Main Button Passive",
        variable: "main-button-P",
    },
    mainButtonActive: {
        name: "Main Button Active",
        variable: "main-button-A",
    },
}

export const presetList = ["a", "b", "custom"] as const
export type PresetList = (typeof presetList)[number]

export const defaultThemePresets: Record<PresetList, ThemeData> = {
    a: {
        mainButtonPassive: "rgba(255,255,0,1)",
        mainButtonActive: "rgba(255,0,0,1)",
    },
    b: {
        mainButtonPassive: "rgba(255,0,0,1)",
        mainButtonActive: "rgba(255,255,0,1)",
    },
    custom: {
        mainButtonPassive: "rgba(255,255,0,1)",
        mainButtonActive: "rgba(255,0,0,1)",
    }
}

export interface ThemeSettingsData {
    current: ThemeData
    preset: PresetList
    custom: ThemeData
}

export const defaultThemeSettings: ThemeSettingsData = {
    preset: "a",
    current: {
        mainButtonPassive: "rgba(255,255,0,1)",
        mainButtonActive: "rgba(255,0,0,1)",
    },
    custom: {
        mainButtonPassive: "rgba(255,255,0,1)",
        mainButtonActive: "rgba(255,0,0,1)",
    }
}


export function changeGlobalCssVariables(theme: ThemeData){
    const keys = Object.keys(enumThemeData) as Array<keyof typeof enumThemeData>
    for (const key of keys){
        const themeData = enumThemeData[key]
        document.documentElement.style.setProperty(`--${themeData.variable}`, theme[key])
    }
}