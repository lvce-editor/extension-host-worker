import * as PlatformType from '../PlatformType/PlatformType.ts'

const getPlatform = () => {
  // @ts-ignore
  if (typeof PLATFORM !== 'undefined') {
    // @ts-ignore
    return PLATFORM
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return PlatformType.Test
  }
  // TODO find a better way to pass runtime environment
  if (typeof name !== 'undefined' && name.endsWith('(Electron)')) {
    return PlatformType.Electron
  }
  if (typeof name !== 'undefined' && name.endsWith('(Web)')) {
    return PlatformType.Web
  }
  return PlatformType.Remote
}

export const platform = getPlatform() // TODO tree-shake this out in production
