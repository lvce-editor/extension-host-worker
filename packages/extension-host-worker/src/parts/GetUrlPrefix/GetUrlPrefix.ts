import * as PlatformType from '../PlatformType/PlatformType.ts'

export const getUrlPrefix = (platform: string, extensionPath: string) => {
  if (extensionPath.startsWith('http://') || extensionPath.startsWith('https://')) {
    return extensionPath
  }
  if (platform === PlatformType.Web) {
    return extensionPath
  }
  if (extensionPath.startsWith('/')) {
    return `/remote${extensionPath}`
  }
  return `/remote/${extensionPath}`
}
