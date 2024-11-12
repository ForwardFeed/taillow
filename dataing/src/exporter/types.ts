import { VersionsAvailable } from "../../../config"
import { CompactGameData } from "../packer/packer"

export type DataVersion = {
    date: number,
    commit: string,
}
export type DataVersions = {
    latest: VersionsAvailable,
    list: Record<VersionsAvailable, DataVersion>,

}

export type AllCompactGamedata = CompactGameData