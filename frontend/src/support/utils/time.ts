import { Time } from '@internationalized/date'

export function getMinutes(time: Time) {
  return time.hour * 60 + time.minute
}

export function getSeconds(time: Time) {
  return getMinutes(time) * 60
}
