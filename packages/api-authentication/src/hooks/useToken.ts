import { useEffect, useState } from 'react'
import {
  getRefreshToken,
  getToken,
  removeRefreshToken,
  removeToken,
  saveRefreshToken,
  saveToken
} from '../helpers/storage'

export interface UseTokenHook {
  token?: string
  refreshToken?: string
  setTokens: (value: { token: string; refreshToken: string }) => void
  removeTokens: () => void
}

export const useToken = (): UseTokenHook => {
  const [token, setToken] = useState<string>()
  const [refreshToken, setRefreshToken] = useState<string>()

  const setTokens = (value: { token: string; refreshToken: string }) => {
    saveToken(value.token)
    saveRefreshToken(value.refreshToken)
    setToken(value.token)
    setRefreshToken(value.refreshToken)
  }

  const removeTokens = () => {
    removeToken()
    removeRefreshToken()
    setToken(undefined)
    setRefreshToken(undefined)
  }

  useEffect(() => {
    const token = getToken()
    const refreshToken = getRefreshToken()
    if (token) {
      setToken(token)
    }
    if (refreshToken) {
      setRefreshToken(refreshToken)
    }
  }, [])

  return { token, refreshToken, setTokens, removeTokens }
}
