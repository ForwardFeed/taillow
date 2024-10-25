export type KeysEnum<T, S = true> = { [P in keyof Required<T>]: S}

export type DeepReadonly<T> = T extends (infer U)[]
    ? ReadonlyArray<DeepReadonly<U>> 
    : {
          readonly [K in keyof T]: T[K] extends object
              ? DeepReadonly<T[K]> 
              // Recursively apply DeepReadonly for nested objects
              : T[K];
              // Otherwise, keep the original type
      };