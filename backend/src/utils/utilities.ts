import { Model } from "../endpoints/Model"

export interface IDictionary<T> {
    [key: string]: T
}

export type DatabaseType = number | string | boolean | Model | IDictionary<DatabaseType> | Model[];
export type SimpleDatabaseType = number | string | boolean;

export async function safeAwait<T>(promise: Promise<T>): Promise<[Error, null] | [null, T]> {
    try {
        const result = await promise
        return [null, result]
    } catch (err) {
        const error = err as Error
        return [error, null]
    }
}