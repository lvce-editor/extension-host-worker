import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'

export const getWebViewPort = (): string => {
  if (Platform.platform === PlatformType.Web) {
    return location.port
  }
  // TODO make port configurable
  return '3002'
}
