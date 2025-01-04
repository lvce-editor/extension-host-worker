import * as GetColorThemeJsonRemote from '../GetColorThemeJsonRemote/GetColorThemeJsonRemote.ts'
import * as GetColorThemeJsonWeb from '../GetColorThemeJsonWeb/GetColorThemeJsonWeb.ts'
import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'

export const getColorThemeJson = (colorThemeId) => {
  if (Platform.platform === PlatformType.Web) {
    return GetColorThemeJsonWeb.getColorThemeJson(colorThemeId)
  }
  return GetColorThemeJsonRemote.getColorThemeJson(colorThemeId)
}
