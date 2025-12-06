import * as AssetDir from '../AssetDir/AssetDir.ts'
import * as ExtensionMetaState from '../ExtensionMetaState/ExtensionMetaState.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as FindMatchingIconThemeExtension from '../FindMatchingIconThemeExtension/FindMatchingIconThemeExtension.ts'
import * as GetExtensions from '../GetExtensions/GetExtensions.ts'
import * as GetIconThemeUrl from '../GetIconThemeUrl/GetIconThemeUrl.ts'
import * as GetJson from '../GetJson/GetJson.ts'
import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'

export const getIconThemeJson = async (iconThemeId) => {
  if (Platform.platform === PlatformType.Web) {
    const url = GetIconThemeUrl.getIconThemeUrl(iconThemeId)
    const json = await GetJson.getJson(url)
    return {
      extensionPath: `${AssetDir.assetDir}/extensions/builtin.${iconThemeId}`,
      json,
    }
  }
  for (const webExtension of ExtensionMetaState.state.webExtensions) {
    if (webExtension.iconThemes) {
      for (const iconTheme of webExtension.iconThemes) {
        // TODO handle error when icon theme path is not of type string
        const iconThemeUrl = `${webExtension.path}/${iconTheme.path}`
        const json = await GetJson.getJson(iconThemeUrl)
        return {
          extensionPath: webExtension.path,
          json,
        }
      }
    }
  }
  const extensions = await GetExtensions.getExtensions()
  const iconTheme = FindMatchingIconThemeExtension.findMatchingIconThemeExtension(extensions, iconThemeId)
  if (!iconTheme) {
    return undefined
  }
  const iconThemePath = `${iconTheme.extensionPath}/${iconTheme.path}`
  const iconThemeJson = await FileSystem.readJson(iconThemePath)
  return {
    extensionPath: iconTheme.extensionPath,
    json: iconThemeJson,
  }
}
