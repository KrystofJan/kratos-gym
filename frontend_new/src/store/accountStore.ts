import { ref } from 'vue';
import type { Ref } from 'vue'
import { Account } from '../support/types'
import { AccountService } from '../support/services';

export const currentAccount: Ref<Account | null> = ref(null);

export async function fetchAccount(clerkId: string): Promise<void> {
    try {
        const data = await new AccountService().fetchAccount(clerkId);
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
