import 'server-only'

import { get } from 'lodash'
import { cookies } from 'next/headers'

export const getCookieValue = (key: string) => {
  const cookieStore = cookies()
  return get(cookieStore.get(key), 'value')
}

export const getAllCookies = () => {
  const cookieStore = cookies()

  const allCookies = cookieStore
    .getAll()
    .map((cookie) => cookie.name + '=' + cookie.value)
    .join('; ')

  return allCookies
}

export const removeAllCookies = () => {
  const cookieStore = cookies()
  cookieStore.getAll().map(({ name }) => {
    cookies().set({
      name,
      value: '',
      expires: new Date(),
      path: '/'
    })
  })
}
