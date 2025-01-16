import { fillParamValues } from '../request-utils';

const KRATOS_API_URL = import.meta.env.VITE_KRATOS_API_URL
export default class BaseService<T, V> {
    path: string;

    constructor(path: string) {
        this.path = path;
    }

    async FetchOne(id: number): Promise<T> {
        try {
            const res = await fetch(`${KRATOS_API_URL}/api/${this.path}/${id}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error fetching account:', error);
            throw error;
        }
    }

    async FetchAll(options?: { page?: number, limit?: number }): Promise<T[]> {
        try {
            let params = ""
            if (options) {
                params = fillParamValues(options)
            }
            const res = await fetch(`${KRATOS_API_URL}/api/${this.path}${params}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error fetching account:', error);
            throw error;
        }
    }

    async Delete(id: number) {
        try {
            const res = await fetch(`${KRATOS_API_URL}/api/${this.path}/${id}`, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error creating account:', error);
            throw error;
        }
    }

    async Create(machine: V) {
        try {
            const res = await fetch(`${KRATOS_API_URL}/api/${this.path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(machine)
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error creating address:', error);
            throw error;
        }
    }

    async Update(model: Partial<T>, id: number) {
        if (!model) {
            throw new Error("Cannot update account because the request body is not working")
        }

        try {
            const res = await fetch(
                `${KRATOS_API_URL}/api/${this.path}/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify(model)
                }
            );
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}
