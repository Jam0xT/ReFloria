type PartialNested<T> = {
    [K in keyof T]?: (T[K] extends Object ? PartialNested<T[K]> : T[K]);
}

export {
    PartialNested,
}