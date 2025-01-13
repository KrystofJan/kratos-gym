import { Model } from '../endpoints/base'

export interface IDictionary<T> {
    [key: string]: T
}

export type SimpleDatabaseType = number | string | boolean | Date
export type DatabaseType =
    | SimpleDatabaseType
    | Model
    | IDictionary<DatabaseType>
    | Model[]

export async function safeAwait<T>(
    promise: Promise<T>
): Promise<[Error, null] | [null, T]> {
    try {
        const result = await promise
        return [null, result]
    } catch (err) {
        const error = err as Error
        return [error, null]
    }
}
