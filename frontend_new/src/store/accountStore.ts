import { ref } from 'vue';
import type { Ref } from 'vue'

export const UserRole = {
    CUSTOMER: 'c',
    TRAINER: 'T',
    EMPLOYEE: 'E',
    USER: 'U',
    NOTKNOWN: '/',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface Address {
    AddressId?: number;
    Street: string;
    City: string;
    PostalCode: string;
    Country: string;
    BuildingNumber: string;
    ApartmentNumber: string;
}

export interface Account {
    AccountId: number;
    FirstName: string;
    LastName: string;
    Role: UserRole;
    Email: string;
    PhoneNumber: string;
    IsActive: Boolean;
    CreateDate: Date;
    LastOnline: Date;
    Password: string;
    Address: Address;
    Credits: number;
    Login: string;
    ClerkId?: string;
}

export const currentAccount: Ref<Account> = ref({
    AccountId: -1,
    FirstName: '',
    LastName: '',
    Role: UserRole.NOTKNOWN,
    Email: '',
    PhoneNumber: '',
    IsActive: false,
    CreateDate: new Date(),
    LastOnline: new Date(),
    Password: '',
    Address: {
        AddressId: 0,
        Street: '',
        City: '',
        PostalCode: '',
        Country: '',
        BuildingNumber: '',
        ApartmentNumber: '',
    },
    Credits: 0,
    Login: '',
    ClerkId: "",
});

