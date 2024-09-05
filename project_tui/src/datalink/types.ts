export interface FullDatalinked{
    species: Datalink[],
    abilities: Datalink[]
}

export interface Datalink{
    constant: string, // string in MAJ that will be in the calc changed at compile time.
    id: number
}

