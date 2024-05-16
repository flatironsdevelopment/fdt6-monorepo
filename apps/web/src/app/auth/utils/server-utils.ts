import 'server-only'

import { GetSessionEndpoint } from 'api-authentication/src/api/session'
import { TOKEN_LOCAL_STORAGE_KEY } from 'api-authentication/src/helpers/storage'
import { getCookie } from 'cookies-next'
import { cookies } from 'next/headers'

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

export const fetchSessionOnServerSide = async () => {
  const accessToken = getCookie(TOKEN_LOCAL_STORAGE_KEY, { cookies }) as string

  try {
    const response = await GetSessionEndpoint({
      client: fetch,
      accessToken
    })

    return response
  } catch (e: any) {
    console.log(e)
  }
}
