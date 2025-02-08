import { Reservation, ReservationPost } from '..'
import BaseService from './base-service'

const KRATOS_API_URL = import.meta.env.VITE_KRATOS_API_URL

export class ReservationService extends BaseService<
  Reservation,
  ReservationPost
> {
  constructor() {
    super('reservation')
  }

  async FetchReservationsByAccountId(
    accountId: number
  ): Promise<Reservation[]> {
    try {
      const res = await fetch(
        `${KRATOS_API_URL}/api/account/${accountId}/reservations`
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

  async CreateFullReservation(reservation: Partial<ReservationPost>) {
    try {
      const res = await fetch(`${KRATOS_API_URL}/api/reservation/full`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(reservation),
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
}
