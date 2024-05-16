import { setCookie } from 'cookies-next'
// this is necessary so that SSR Next.js can have access to the token

export const TOKEN_LOCAL_STORAGE_KEY = 'auth:token'
export const REFRESH_TOKEN_LOCAL_STORAGE_KEY = 'auth:refreshToken'

const setItem = (key: string, value: string) => {
  localStorage.setItem(key, value)
}

const getItem = (key: string) => {
  const value = localStorage.getItem(key)
  return value
}

const removeItem = (key: string) => {
  localStorage.removeItem(key)
}

export const saveToken = (token: string) => {
  setItem(TOKEN_LOCAL_STORAGE_KEY, token)
  setCookie(TOKEN_LOCAL_STORAGE_KEY, token)
  return token
}

export const getToken = () => {
  return getItem(TOKEN_LOCAL_STORAGE_KEY)
}

export const removeToken = () => {
  removeItem(TOKEN_LOCAL_STORAGE_KEY)
}

export const saveRefreshToken = (refreshToken: string) => {
  setItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY, refreshToken)
  setCookie(REFRESH_TOKEN_LOCAL_STORAGE_KEY, refreshToken)
  return refreshToken
}

export const getRefreshToken = () => {
  return getItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY)
}

export const removeRefreshToken = () => {
  removeItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY)
}
