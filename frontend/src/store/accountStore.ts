import { ref } from 'vue';
import type { Ref } from 'vue'
import { Account, AccountCreate } from '../support/types'
import { AccountService } from '../support/services';

export const currentAccount: Ref<Account | null> = ref(null);

export async function fetchAccount(clerkId: string): Promise<void> {
    try {
        const data = await new AccountService().FetchByClerkId(clerkId);
        currentAccount.value = data;
    } catch (error) {
        console.error('Error fetching account:', error);
        // Instead of throwing, we set currentAccount to null to indicate a failed fetch
        currentAccount.value = null;
    }
}

export function updateAccount(newData: Partial<Account>): void {
    if (currentAccount.value) {
        Object.assign(currentAccount.value, newData);
    } else {
        console.warn('Attempted to update account before it was fetched');
    }
}

export async function createAccount(body: AccountCreate) {
    if (!currentAccount.value) {
        const accountService = new AccountService();
        const account = await accountService.CreateAccount(body);
        // TODO: This returns the correct stuff, need to rename the response in the backend
        updateAccount(account.CreatedId);
    }
}
