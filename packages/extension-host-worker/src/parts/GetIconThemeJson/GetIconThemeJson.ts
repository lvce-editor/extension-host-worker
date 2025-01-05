import * as CacheEnabled from '../CacheEnabled/CacheEnabled.ts'
import * as DoGetIconThemeJson from '../DoGetIconThemeJson/DoGetIconThemeJson.ts'
import * as IconThemeCache from '../IconThemeCache/IconThemeCache.ts'

const getIconThemeCacheFirst = async (iconThemeId: string) => {
  const cached = await IconThemeCache.get()
  if (cached) {
    return cached
  }
  const items = await DoGetIconThemeJson.getIconThemeJson(iconThemeId)
  await IconThemeCache.set(items)
  return items
}

export const getIconThemeJson = async (iconThemeId: string): Promise<any> => {
  if (CacheEnabled.cacheEnabled) {
    return getIconThemeCacheFirst(iconThemeId)
  }
  return DoGetIconThemeJson.getIconThemeJson(iconThemeId)
}
