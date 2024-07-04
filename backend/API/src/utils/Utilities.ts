
export interface IDictionary<T> {
    [key: string]: T
}

export interface ColumnOptions {
    type: 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'foreignObject' | 'UserRole';
    columnName: string;
}
