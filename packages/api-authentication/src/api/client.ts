import merge from 'lodash.merge'
import { fetchJSON } from 'refresh-fetch'

export type ApiClient = (
  url: string,
  options: RequestInit
) => Promise<{
  body: unknown
  response: Response
}>

export const apiClient: ApiClient = (url: string, options: RequestInit) => {
  let mergedOptions = options

  mergedOptions = merge({}, options, {})

  return fetchJSON(url, { ...mergedOptions })
}
