import * as CreateColorThemeFromJson from '../CreateColorThemeFromJson/CreateColorThemeFromJson.ts'
import * as GetColorThemeCssCached from '../GetColorThemeCssCached/GetColorThemeCssCached.ts'
import * as GetColorThemeJson from '../GetColorThemeJson/GetColorThemeJson.ts'

export const getColorThemeCssFromJson = async (colorThemeId, colorThemeJson) => {
  const colorThemeCss = CreateColorThemeFromJson.createColorThemeFromJson(/* colorThemeId */ colorThemeId, /* colorThemeJson */ colorThemeJson)
  return colorThemeCss
  // TODO generate color theme from jsonc
}

const getColorThemeCssNew = async (colorThemeId) => {
  const colorThemeJson = await GetColorThemeJson.getColorThemeJson(colorThemeId)
  const colorThemeCss = await getColorThemeCssFromJson(colorThemeId, colorThemeJson)
  return colorThemeCss
}

export const getColorThemeCss = (colorThemeId) => {
  return GetColorThemeCssCached.getColorThemeCssCached(colorThemeId, getColorThemeCssNew)
}
