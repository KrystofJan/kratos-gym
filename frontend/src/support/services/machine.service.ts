
import type { Machine } from '../types';

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

}
