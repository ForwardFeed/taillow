import type { GeneralConfig } from "./config_types"

export const versionsAvailable = ["vanilla", "ER2.5"] as const
export type VersionsAvailable = (typeof versionsAvailable)[number]


export const config: GeneralConfig = {
    appName: "ER-Taillow",
}