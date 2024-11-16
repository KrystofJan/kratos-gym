
import type { Machine } from '../types';
import { fillParamValues } from '../request-utils';

const KRATOS_API_URL = import.meta.env.VITE_KRATOS_API_URL

export class MachineService {

    constructor() {
    }

    async FetchMachine(id: number): Promise<Machine> {
        try {
            const res = await fetch(`${KRATOS_API_URL}/api/machine/${id}`);
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


    async FetchRecommendMachine(id: number): Promise<Machine[]> {
        try {
            const res = await fetch(`${KRATOS_API_URL}/api/machine/recommend/${id}`);
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

    async FetchMachines(options?: { page?: number, limit?: number }): Promise<Machine[]> {
        try {
            let params = ""
            if (options) {
                params = fillParamValues(options)
            }
            const res = await fetch(`${KRATOS_API_URL}/api/machine${params}`);
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

    async DeleteMachine(id: number) {
        try {
            const res = await fetch(`${KRATOS_API_URL}/api/machine/${id}`, {
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
}

