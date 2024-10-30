
export interface QueryParam {
    key: string,
    operator: '=' | '>' | '<'
    value: string
}

export function fillParamValues(options: { page?: number, limit?: number }) {

    const paramArr: QueryParam[] = []
    for (const [key, val] of Object.entries(options)) {
        const value = val.toString()
        paramArr.push(
            {
                key,
                value,
                operator: '=' // NOTE: Change this to dynamic param
            }
        )
    }
    return '?' + paramArr.map(par => {
        return `${par.key}${par.operator}${par.value}`
    }
    ).join('&')
}
