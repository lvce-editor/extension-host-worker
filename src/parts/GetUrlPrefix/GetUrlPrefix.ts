import * as AssetDir from '../AssetDir/AssetDir.ts'
import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'

export const getUrlPrefix = (extensionPath: string) => {
  if (extensionPath.startsWith('http://') || extensionPath.startsWith('https://')) {
    return extensionPath
  }
  if (Platform.platform === PlatformType.Web) {
    return `${AssetDir.assetDir}${extensionPath}`
  }
  return `/remote${extensionPath}`
}
