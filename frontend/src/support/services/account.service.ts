import type { Account, AccountCreate, Address } from '../types';

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
            const res = await fetch(`${KRATOS_API_URL}/api/auth/new-account`, {
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
            return data;
        } catch (error) {
            console.error('Error creating account:', error);
            throw error;
        }
    }

    async AddAddressToAccount(address: Address, accountId: number) {
        if (!address.AddressId) {
            throw new Error("Cannot update address for user because the user model has no id")
        }

        try {
            const res = await fetch(
                `${KRATOS_API_URL}/api/account/${accountId}/address/set`,
                {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ "AddressId": address.AddressId })
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