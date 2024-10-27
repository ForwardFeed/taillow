export type KeysEnum<T, S = true> = { [P in keyof Required<T>]: S}