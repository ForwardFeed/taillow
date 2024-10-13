import { VersionsAvailable } from "../config"
import { ER21CompactGamedata } from "../src/packer/er21"
import { CompactGameDataVanilla } from "../src/packer/vanilla"

export type DataVersion = {
    date: number,
    commit: string,
}
export type DataVersions = {
    latest: VersionsAvailable,
    list: Record<VersionsAvailable, DataVersion>,

}

export type AllCompactGamedata = CompactGameDataVanilla | ER21CompactGamedata