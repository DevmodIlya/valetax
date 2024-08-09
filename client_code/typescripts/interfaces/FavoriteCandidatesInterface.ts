export interface FavoriteCandidatesCollection {
    collName: string
    collDate: string
    collUpdate: string
    candidates: { [key: string]: string }
}

export interface FavoriteCandidatesInterface {
    [key: string]: FavoriteCandidatesCollection
}