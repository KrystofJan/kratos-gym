import { Model } from "../endpoints/Model"
import { BaseError } from "../errors/base.error";

export interface IDictionary<T> {
    [key: string]: T
}

export type DatabaseType = number | string | boolean | Model | IDictionary<DatabaseType> | Model[];
export type SimpleDatabaseType = number | string | boolean;

export async function safeAwait<T>(promise: Promise<T>): Promise<[BaseError | null, T | null]> {
    try {
        const result = await promise
        return [null, result]
    } catch (err) {
        return [err, null]
    }
}
