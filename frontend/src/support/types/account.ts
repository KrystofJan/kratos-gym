import { Address } from './address'

export const UserRoleOptions = {
  CUSTOMER: 'c',
  TRAINER: 'T',
  EMPLOYEE: 'e',
  AUTHOR: 'A',
  NOTKNOWN: '/',
} as const

export type UserRole = (typeof UserRoleOptions)[keyof typeof UserRoleOptions]

export interface Account {
  AccountId: number
  FirstName: string
  LastName: string
  Role: UserRole
  Email: string
  PhoneNumber: string
  IsActive: Boolean
  CreateDate: Date
  LastOnline: Date
  Address?: Address
  Credits: number
  Login: string
  ClerkId: string
  ProfilePictureUrl: string
}

export const roleDictionary = new Map([
  ['c', 'Customer'],
  ['t', 'Trainer'],
  ['e', 'Employee'],
  ['a', 'Author'],
])

export const roleMap = new Map([
  [UserRoleOptions.CUSTOMER, 'Customer'],
  [UserRoleOptions.TRAINER, 'Trainer'],
  [UserRoleOptions.EMPLOYEE, 'Employee'],
  [UserRoleOptions.AUTHOR, 'Author'],
])

export const roleCharMap = new Map([
  ['c', 'CUSTOMER'],
  ['t', 'TRAINER'],
  ['e', 'EMPLOYEE'],
  ['a', 'AUTHOR'],
  ['/', 'NOTKNOWN'],
])
