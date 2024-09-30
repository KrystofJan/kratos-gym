import type { Account } from '../types';

const KRATOS_API_URL = import.meta.env.VITE_KRATOS_API_URL

export class AccountService {

    constructor() {
    }

    async fetchAccount(clerkId: string): Promise<Account> {
        try {
            const res = await fetch(`${KRATOS_API_URL}/api/account/clerk/${clerkId}`);
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
