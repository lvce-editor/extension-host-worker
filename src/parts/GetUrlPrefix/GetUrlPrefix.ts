import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'

export const getUrlPrefix = (extensionPath: string) => {
  if (extensionPath.startsWith('http://') || extensionPath.startsWith('https://')) {
    return extensionPath
  }
  if (Platform.platform === PlatformType.Web) {
    return extensionPath
  }
  if (extensionPath.startsWith('/')) {
    return `/remote${extensionPath}`
  }
  return `/remote/${extensionPath}`
}
