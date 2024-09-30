import { Address } from "./address";

export const UserRole = {
    CUSTOMER: 'c',
    TRAINER: 'T',
    EMPLOYEE: 'E',
    USER: 'U',
    NOTKNOWN: '/',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

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
