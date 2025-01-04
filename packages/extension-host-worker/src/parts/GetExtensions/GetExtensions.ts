import * as ExtensionMeta from '../ExtensionMeta/ExtensionMeta.ts'
import * as ExtensionsCache from '../ExtensionsCache/ExtensionsCache.ts'

export const getExtensions = () => {
  if (!ExtensionsCache.has()) {
    ExtensionsCache.set(ExtensionMeta.getExtensions())
  }
  return ExtensionsCache.get()
}
