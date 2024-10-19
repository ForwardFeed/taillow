
export interface CompactSpecieVanilla{
    abilities: number[]
    name: string,
    NAME: string,
}

export interface CompactSpecieER21 extends CompactSpecieVanilla{
    innates: number[]
}

export type CompactSpecie = CompactSpecieVanilla & Partial<CompactSpecieER21>