import * as ExtensionsCache from '../ExtensionsCache/ExtensionsCache.ts'

export const invalidateExtensionsCache = (): void => {
  ExtensionsCache.clear()
}
