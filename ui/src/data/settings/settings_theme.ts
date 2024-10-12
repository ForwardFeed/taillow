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
}

export type ThemeDataKeys = {
    name: string,
    tooltip?: string,
    variable: string
}

export const enumThemeData: KeysEnum<ThemeData, ThemeDataKeys> = {
    topNavPassive: {
        name: "Main Nav Passive",
        variable: "main-nav-P",
    },
    topNavActive: {
        name: "Main Nav Active",
        variable: "main-nav-A",
    },
    topNavHover: {
        name: "Main Nav Hover",
        tooltip: "When the mouse passes over",
        variable: "main-nav-H"
    },
    subNavPassive: {
        name: "Secondary Nav Passive",
        tooltip: undefined,
        variable: "sub-nav-P"
    },
    subNavActive: {
        name: "Secondary Nav Active",
        tooltip: undefined,
        variable: "sub-nav-A"
    },
    subNavHover: {
        name: "Secondary Nav Hover",
        tooltip: undefined,
        variable: "sub-nav-H"
    },
    buttonPassive: {
        name: "Button Passive",
        tooltip: undefined,
        variable: "btn-P"
    },
    buttonActive: {
        name: "Button Active",
        tooltip: undefined,
        variable: "btn-A"
    },
    buttonHover: {
        name: "Button Hover",
        tooltip: undefined,
        variable: "btn-H"
    },
    bg1: {
        name: "Background 1",
        tooltip: undefined,
        variable: "bg1"
    },
    bg1Alt: {
        name: "Background 1 Alternative",
        tooltip: undefined,
        variable: "bg1A"
    },
    bg2: {
        name: "Background 2",
        tooltip: undefined,
        variable: "bg2"
    },
    bg2Alt: {
        name: "Background 2 Alternative",
        tooltip: undefined,
        variable: "bg2A"
    },
    bg3: {
        name: "Background 3",
        tooltip: undefined,
        variable: "bg3"
    },
    bg3Alt: {
        name: "Background 3 Alternative",
        tooltip: undefined,
        variable: "bg3A"
    },
    font: {
        name: "Font Color",
        tooltip: undefined,
        variable: "font-color"
    }
}

export const presetList = ["a", "b", "custom"] as const
export type PresetList = (typeof presetList)[number]

export const defaultThemePresets: Record<PresetList, ThemeData> = {
    a: {
        "topNavPassive": "rgba(111,82,121,1)",
        "topNavActive": "rgba(111,82,121,1)",
        "topNavHover": "rgba(111,82,121,1)",
        "subNavPassive": "rgba(116,109,183,1)",
        "subNavActive": "rgba(92,67,139,1)",
        "subNavHover": "rgba(113,96,137,1)",
        "buttonPassive": "rgba(255,255,0,1)",
        "buttonActive": "rgba(255,255,0,1)",
        "buttonHover": "rgba(255,255,0,1)",
        "bg1": "rgba(134,133,236,1)",
        "bg1Alt": "rgba(255,255,0,1)",
        "bg2": "rgba(255,255,0,1)",
        "bg2Alt": "rgba(63,63,23,1)",
        "bg3": "rgba(255,255,0,1)",
        "bg3Alt": "rgba(0,0,0,1)",
        "font": "rgba(0,0,0,1)"
    },
    b: {
        topNavPassive: "rgba(255,0,0,1)",
        topNavActive: "rgba(255,255,0,1)",
        topNavHover: "rgba(255,0,0,1)",
        subNavPassive: "rgba(255,255,0,1)",
        subNavActive: "rgba(255,255,0,1)",
        subNavHover: "rgba(255,255,0,1)",
        buttonPassive: "rgba(255,255,0,1)",
        buttonActive: "rgba(255,255,0,1)",
        buttonHover: "rgba(255,255,0,1)",
        bg1: "rgba(255,255,0,1)",
        bg1Alt: "rgba(255,255,0,1)",
        bg2: "rgba(255,255,0,1)",
        bg2Alt: "rgba(255,255,0,1)",
        bg3: "rgba(255,255,0,1)",
        bg3Alt: "rgba(255,255,0,1)",
        font: "rgba(0,0,0,1)",
    },
    custom: {
        topNavPassive: "rgba(255,255,0,1)",
        topNavActive: "rgba(255,0,0,1)",
        topNavHover: "rgba(255,0,0,1)",
        subNavPassive: "rgba(255,255,0,1)",
        subNavActive: "rgba(255,255,0,1)",
        subNavHover: "rgba(255,255,0,1)",
        buttonPassive: "rgba(255,255,0,1)",
        buttonActive: "rgba(255,255,0,1)",
        buttonHover: "rgba(255,255,0,1)",
        bg1: "rgba(255,255,0,1)",
        bg1Alt: "rgba(255,255,0,1)",
        bg2: "rgba(255,255,0,1)",
        bg2Alt: "rgba(255,255,0,1)",
        bg3: "rgba(255,255,0,1)",
        bg3Alt: "rgba(255,255,0,1)",
        font: "rgba(0,0,0,1)",
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
        subNavPassive: "rgba(255,255,0,1)",
        subNavActive: "rgba(255,255,0,1)",
        subNavHover: "rgba(255,255,0,1)",
        buttonPassive: "rgba(255,255,0,1)",
        buttonActive: "rgba(255,255,0,1)",
        buttonHover: "rgba(255,255,0,1)",
        bg1: "rgba(255,255,0,1)",
        bg1Alt: "rgba(255,255,0,1)",
        bg2: "rgba(255,255,0,1)",
        bg2Alt: "rgba(255,255,0,1)",
        bg3: "rgba(255,255,0,1)",
        bg3Alt: "rgba(255,255,0,1)",
        font: "rgba(0,0,0,1)",
    },
    custom: {
        topNavPassive: "rgba(255,255,0,1)",
        topNavActive: "rgba(255,0,0,1)",
        topNavHover: "rgba(255,0,0,1)",
        subNavPassive: "rgba(255,255,0,1)",
        subNavActive: "rgba(255,255,0,1)",
        subNavHover: "rgba(255,255,0,1)",
        buttonPassive: "rgba(255,255,0,1)",
        buttonActive: "rgba(255,255,0,1)",
        buttonHover: "rgba(255,255,0,1)",
        bg1: "rgba(255,255,0,1)",
        bg1Alt: "rgba(255,255,0,1)",
        bg2: "rgba(255,255,0,1)",
        bg2Alt: "rgba(255,255,0,1)",
        bg3: "rgba(255,255,0,1)",
        bg3Alt: "rgba(255,255,0,1)",
        font: "rgba(0,0,0,1)",
    }
}


export function changeGlobalCssVariables(theme: ThemeData){
    const keys = Object.keys(enumThemeData) as Array<keyof typeof enumThemeData>
    for (const key of keys){
        const themeData = enumThemeData[key]
        document.documentElement.style.setProperty(`--${themeData.variable}`, theme[key])
    }
}