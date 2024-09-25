// The types here are for the whole repo, but for ease we've dropped them into the FE folder.
export type RequireSubset<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export type PartialSubset<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] }

export * from './conversations';
