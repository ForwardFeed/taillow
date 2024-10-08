type presetList = "a" | "b"

export interface ThemeSettingsData {
    color1: string,
    color2: string
    preset: presetList
}

export const defaultThemeSettings: ThemeSettingsData = {
    preset: "a",
    color1: "theme",
    color2: "a",
}