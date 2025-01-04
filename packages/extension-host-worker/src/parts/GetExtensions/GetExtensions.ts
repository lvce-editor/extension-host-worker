import * as ExtensionMeta from '../ExtensionMeta/ExtensionMeta.ts'
import * as ExtensionsCache from '../ExtensionsCache/ExtensionsCache.ts'

// TODO getExtensions is still called 6 times on startup instead of 1
export const getExtensions = () => {
  if (!ExtensionsCache.has()) {
    ExtensionsCache.set(ExtensionMeta.getExtensions())
  }
  return ExtensionsCache.get()
}
