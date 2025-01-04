import * as Assert from '../Assert/Assert.ts'
import * as Css from '../Css/Css.ts'
import * as GetColorThemeCss from '../GetColorThemeCss/GetColorThemeCss.ts'
import * as GetMetaThemeColor from '../GetMetaThemeColor/GetMetaThemeColor.ts'
import * as Meta from '../Meta/Meta.ts'
import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'
import * as Preferences from '../Preferences/Preferences.ts'
import * as Rpc from '../Rpc/Rpc.ts'
import { VError } from '../VError/VError.ts'
// TODO by default color theme should come from local storage, session storage, cache storage, indexeddb or blob url -> fast initial load
// actual color theme can be computed after workbench has loaded (most times will be the same and doesn't need to be computed)

export const state: any = {
  watchedTheme: '',
}

const FALLBACK_COLOR_THEME_ID = 'slime'

// TODO json parsing should also happen in renderer worker
// so that all validation is here (json parsing errors, invalid shape, ...)

const applyColorTheme = async (colorThemeId) => {
  try {
    Assert.string(colorThemeId)
    state.colorTheme = colorThemeId
    const colorThemeCss = await GetColorThemeCss.getColorThemeCss(colorThemeId)
    await Css.addCssStyleSheet('ContributedColorTheme', colorThemeCss)
    if (Platform.platform === PlatformType.Web) {
      const themeColor = GetMetaThemeColor.getMetaThemeColor(colorThemeId) || ''
      await Meta.setThemeColor(themeColor)
    }
    if (Platform.platform !== PlatformType.Web && (await Preferences.get('development.watchColorTheme'))) {
      watch(colorThemeId)
    }
  } catch (error) {
    throw new VError(error, `Failed to apply color theme "${colorThemeId}"`)
  }
}

export const setColorTheme = async (colorThemeId) => {
  await applyColorTheme(colorThemeId)
  // TODO should preferences throw errors or should it call handleError directly?
  await Preferences.set('workbench.colorTheme', colorThemeId)
}

export const watch = async (id) => {
  if (state.watchedTheme === id) {
    return
  }
  state.watchedTheme = id
  await Rpc.invoke('ExtensionHost.watchColorTheme', id)
}

const getPreferredColorTheme = () => {
  const preferredColorTheme = Preferences.get('workbench.colorTheme')
  return preferredColorTheme
}

export const reload = async () => {
  const colorThemeId = getPreferredColorTheme()
  await applyColorTheme(colorThemeId)
}

// TODO test this, and also the error case
// TODO have icon theme, color theme together (maybe)
export const hydrate = async () => {
  const preferredColorTheme = await getPreferredColorTheme()
  const colorThemeId = preferredColorTheme || FALLBACK_COLOR_THEME_ID
  try {
    await applyColorTheme(colorThemeId)
  } catch (error) {
    if (colorThemeId === FALLBACK_COLOR_THEME_ID) {
      throw error
    }
    console.error(error)
    await applyColorTheme(FALLBACK_COLOR_THEME_ID)
  }
}
