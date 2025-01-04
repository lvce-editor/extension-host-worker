import * as AssetDir from '../AssetDir/AssetDir.ts'
import * as GetJson from '../GetJson/GetJson.ts'

const getColorThemeUrlWeb = (colorThemeId) => {
  return `${AssetDir.assetDir}/extensions/builtin.theme-${colorThemeId}/color-theme.json`
}

export const getColorThemeJson = (colorThemeId) => {
  const url = getColorThemeUrlWeb(colorThemeId)
  // TODO handle error ?
  return GetJson.getJson(url)
}
