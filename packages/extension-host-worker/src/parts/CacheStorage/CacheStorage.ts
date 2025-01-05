import * as CreateResponseFromData from '../CreateResponseFromData/CreateResponseFromData.ts'
import { VError } from '../VError/VError.ts'

const cacheName = 'Extensions' // TODO

export const getJson = async (cacheKey: string): Promise<any> => {
  const response = await caches.match(cacheKey, {
    cacheName,
  })
  if (!response) {
    return undefined
  }
  const json = await response.json()
  return json
}

export const setJson = async (cacheKey: string, data: any): Promise<void> => {
  try {
    const cache = await caches.open(cacheName)
    const response = CreateResponseFromData.createResponseFromData(data)
    await cache.put(cacheKey, response)
  } catch (error) {
    throw new VError(error, `Failed to add to cache`)
  }
}
