import type { Account, AccountCreate, Address, UserRole } from '../types'
import { roleDictionary } from '../types'
import BaseService from './base-service'

const KRATOS_API_URL = import.meta.env.VITE_KRATOS_API_URL

export class AccountService {
  baseService: BaseService<Account, Account>
  constructor() {
    this.baseService = new BaseService('account')
  }

  async FetchByClerkId(clerkId: string): Promise<Account> {
    try {
      const res = await fetch(`${KRATOS_API_URL}/api/account/clerk/${clerkId}`)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      return data
    } catch (error) {
      console.error('Error fetching account:', error)
      throw error
    }
  }

  async Delete(id: number) {
    try {
      return this.baseService.Delete(id)
    } catch (err) {
      throw err
    }
  }

  async FetchOne(id: number): Promise<Account> {
    try {
      const res = await fetch(`${KRATOS_API_URL}/api/account/${id}`)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      return data
    } catch (error) {
      console.error('Error fetching account:', error)
      throw error
    }
  }

  async fetchAccounts(): Promise<Account[]> {
    try {
      const res = await fetch(`${KRATOS_API_URL}/api/account`)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      return data
    } catch (error) {
      console.error('Error fetching account:', error)
      throw error
    }
  }

  async fetchAccountByRole(role: UserRole): Promise<Account[]> {
    try {
      const res = await fetch(
        `${KRATOS_API_URL}/api/account?role=${roleDictionary.get(role.toLowerCase())}`
      )
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      return data
    } catch (error) {
      console.error('Error fetching account:', error)
      throw error
    }
  }

  async CreateAccount(account: AccountCreate) {
    try {
      const res = await fetch(`${KRATOS_API_URL}/api/auth/new-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(account),
      })
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      return data
    } catch (error) {
      console.error('Error creating account:', error)
      throw error
    }
  }

  async AddAddressToAccount(address: Address, accountId: number) {
    if (!address.AddressId) {
      throw new Error(
        'Cannot update address for user because the user model has no id'
      )
    }

    try {
      const res = await fetch(
        `${KRATOS_API_URL}/api/account/${accountId}/address/set`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ AddressId: address.AddressId }),
        }
      )
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      return data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async UpdateAccount(account: Partial<Account>, accountId: number) {
    if (!account) {
      throw new Error(
        'Cannot update account because the request body is not working'
      )
    }

    try {
      const res = await fetch(`${KRATOS_API_URL}/api/account/${accountId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(account),
      })
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      return data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
