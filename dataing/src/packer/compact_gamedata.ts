// ease the reading
export type Indexed = number

export interface CompactSpecies{
    abilities: Indexed[]
}

export interface CompactGameData<Species extends CompactSpecies>{
    species: Array<Species>
}