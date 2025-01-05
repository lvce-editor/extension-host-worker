import * as CacheStorage from '../CacheStorage/CacheStorage.ts'
import * as IconThemeCacheKey from '../IconThemeCacheKey/IconThemeCacheKey.ts'

export const set = async (data: any): Promise<void> => {
  return CacheStorage.setJson(IconThemeCacheKey.iconThemeCacheKey, data)
}

export const get = (): Promise<any> => {
  return CacheStorage.getJson(IconThemeCacheKey.iconThemeCacheKey)
}
