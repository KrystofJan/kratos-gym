import { Address } from "./address";

export const UserRoleOptions = {
    CUSTOMER: 'c',
    TRAINER: 'T',
    EMPLOYEE: 'E',
    AUTHOR: 'A',
    NOTKNOWN: '/',
} as const;

export type UserRole = typeof UserRoleOptions[keyof typeof UserRoleOptions];

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
    Address?: Address;
    Credits: number;
    Login: string;
    ClerkId: string;
    ProfilePictureUrl: string;
}
