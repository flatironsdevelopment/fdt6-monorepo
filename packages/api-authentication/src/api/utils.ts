import { camelCase } from 'lodash'

const camelizeKeys = <T extends any>(obj: T): T | Array<T> => {
  if (Array.isArray(obj)) {
    return obj.map((v) => camelizeKeys(v))
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: camelizeKeys((obj as any)[key])
      }),
      {}
    ) as T
  }
  return obj
}

export const handleResponse = async (res: Response) => {
  if (res.ok) {
    const response = await res.json()
    return camelizeKeys(response)
  }
  const er = await res.json()
  throw new Error(er.message)
}

export const handleRefetchResponse = async (res: any) => {
  return camelizeKeys(res.body)
}
