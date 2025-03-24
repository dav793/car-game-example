
/**
 * Makes a single property optional in a type
 * @template T - The source type
 * @template K - The property to make optional (must be a key of T)
 */
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
