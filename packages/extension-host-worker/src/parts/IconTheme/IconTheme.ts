import * as GetIconThemeJson from '../GetIconThemeJson/GetIconThemeJson.ts'
import * as HandleIconThemeChange from '../HandleIconThemeChange/HandleIconThemeChange.ts'
import * as IconThemeState from '../IconThemeState/IconThemeState.ts'
import * as Preferences from '../Preferences/Preferences.ts'
import { VError } from '../VError/VError.ts'

export const setIconTheme = async (iconThemeId: string): Promise<void> => {
  try {
    const iconTheme = await GetIconThemeJson.getIconThemeJson(iconThemeId)
    if (!iconTheme) {
      return
    }
    IconThemeState.setTheme(iconTheme)
    await HandleIconThemeChange.handleIconThemeChange()
  } catch (error) {
    console.error(new VError(error, 'Failed to load icon theme'))
  }
}

export const hydrate = async (): Promise<void> => {
  const iconThemeId = (await Preferences.get('icon-theme')) || 'vscode-icons'
  await setIconTheme(iconThemeId)
}
