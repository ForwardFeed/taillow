import type { KeysEnum } from "@/utils/types"

// rip template litterals: type RGBA = `${RGBAValue},${RGBAValue},${RGBAValue},${number}`

export type ThemeData = {
    topNavPassive: string
    topNavActive: string
    topNavHover: string,
    subNavPassive: string,
    subNavActive: string,
    subNavHover: string,
    buttonPassive: string
    buttonActive: string,
    buttonHover: string,
    bg1: string
    bg1Alt: string,
    bg2: string,
    bg2Alt: string,
    bg3: string
    bg3Alt: string,
    font: string,
    fontSize: string,
}

export type ThemeDataKeys = {
    name: string,
    tooltip?: string,
    variable: string
}

export const enumThemeData: KeysEnum<ThemeData, ThemeDataKeys> = {
    topNavPassive: {
        name: "Main Button Passive",
        variable: "main-button-P",
    },
    topNavActive: {
        name: "Main Button Active",
        variable: "main-button-A",
    },
    topNavHover: {
        name: "Main Button Hover",
        tooltip: "When the mouse passes over",
        variable: "main-button-H"
    },
    subNavPassive: {
        name: "",
        tooltip: undefined,
        variable: ""
    },
    subNavActive: {
        name: "",
        tooltip: undefined,
        variable: ""
    },
    subNavHover: {
        name: "",
        tooltip: undefined,
        variable: ""
    },
    buttonPassive: {
        name: "",
        tooltip: undefined,
        variable: ""
    },
    buttonActive: {
        name: "",
        tooltip: undefined,
        variable: ""
    },
    buttonHover: {
        name: "",
        tooltip: undefined,
        variable: ""
    },
    bg1: {
        name: "",
        tooltip: undefined,
        variable: ""
    },
    bg1Alt: {
        name: "",
        tooltip: undefined,
        variable: ""
    },
    bg2: {
        name: "",
        tooltip: undefined,
        variable: ""
    },
    bg2Alt: {
        name: "",
        tooltip: undefined,
        variable: ""
    },
    bg3: {
        name: "",
        tooltip: undefined,
        variable: ""
    },
    bg3Alt: {
        name: "",
        tooltip: undefined,
        variable: ""
    },
    font: {
        name: "",
        tooltip: undefined,
        variable: ""
    },
    fontSize: {
        name: "",
        tooltip: undefined,
        variable: ""
    }
}

export const presetList = ["a", "b", "custom"] as const
export type PresetList = (typeof presetList)[number]

export const defaultThemePresets: Record<PresetList, ThemeData> = {
    a: {
        topNavPassive: "rgba(255,255,0,1)",
        topNavActive: "rgba(255,0,0,1)",
        topNavHover: "rgba(255,0,0,1)",
        subNavPassive: "",
        subNavActive: "",
        subNavHover: "",
        buttonPassive: "",
        buttonActive: "",
        buttonHover: "",
        bg1: "",
        bg1Alt: "",
        bg2: "",
        bg2Alt: "",
        bg3: "",
        bg3Alt: "",
        font: "",
        fontSize: ""
    },
    b: {
        topNavPassive: "rgba(255,0,0,1)",
        topNavActive: "rgba(255,255,0,1)",
        topNavHover: "rgba(255,0,0,1)",
        subNavPassive: "",
        subNavActive: "",
        subNavHover: "",
        buttonPassive: "",
        buttonActive: "",
        buttonHover: "",
        bg1: "",
        bg1Alt: "",
        bg2: "",
        bg2Alt: "",
        bg3: "",
        bg3Alt: "",
        font: "",
        fontSize: ""
    },
    custom: {
        topNavPassive: "rgba(255,255,0,1)",
        topNavActive: "rgba(255,0,0,1)",
        topNavHover: "rgba(255,0,0,1)",
        subNavPassive: "",
        subNavActive: "",
        subNavHover: "",
        buttonPassive: "",
        buttonActive: "",
        buttonHover: "",
        bg1: "",
        bg1Alt: "",
        bg2: "",
        bg2Alt: "",
        bg3: "",
        bg3Alt: "",
        font: "",
        fontSize: ""
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
        topNavPassive: "rgba(255,255,0,1)",
        topNavActive: "rgba(255,0,0,1)",
        topNavHover: "rgba(255,0,0,1)",
        subNavPassive: "",
        subNavActive: "",
        subNavHover: "",
        buttonPassive: "",
        buttonActive: "",
        buttonHover: "",
        bg1: "",
        bg1Alt: "",
        bg2: "",
        bg2Alt: "",
        bg3: "",
        bg3Alt: "",
        font: "",
        fontSize: ""
    },
    custom: {
        topNavPassive: "rgba(255,255,0,1)",
        topNavActive: "rgba(255,0,0,1)",
        topNavHover: "rgba(255,0,0,1)",
        subNavPassive: "",
        subNavActive: "",
        subNavHover: "",
        buttonPassive: "",
        buttonActive: "",
        buttonHover: "",
        bg1: "",
        bg1Alt: "",
        bg2: "",
        bg2Alt: "",
        bg3: "",
        bg3Alt: "",
        font: "",
        fontSize: ""
    }
}


export function changeGlobalCssVariables(theme: ThemeData){
    const keys = Object.keys(enumThemeData) as Array<keyof typeof enumThemeData>
    for (const key of keys){
        const themeData = enumThemeData[key]
        document.documentElement.style.setProperty(`--${themeData.variable}`, theme[key])
    }
}