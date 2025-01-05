import * as ExtensionsCache from '../ExtensionsCache/ExtensionsCache.ts'
import * as GetWebExtensionManifest from '../GetWebExtensionManifest/GetWebExtensionManifest.ts'
import * as GetWebManifestPath from '../GetWebManifestPath/GetWebManifestPath.ts'

export const addWebExtension = async (path: string): Promise<any> => {
  const manifestPath = GetWebManifestPath.getWebManifestPath(path)
  const manifest = await GetWebExtensionManifest.getWebExtensionManifest(path, manifestPath)
  ExtensionsCache.clear()
  return manifest
}
