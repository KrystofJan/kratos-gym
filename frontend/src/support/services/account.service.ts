import type { Account, AccountCreate } from '../types';

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

    async CreateAccount(account: AccountCreate) {
        try {
            console.log(JSON.stringify(account)
            )
            const res = await fetch(`http://localhost:5173/api/auth/new-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(account)
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            console.log(data)
            return data;
        } catch (error) {
            console.error('Error creating account:', error);
            throw error;
        }
    }

}
