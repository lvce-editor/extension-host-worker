// TODO make storage configurable via settings as localstorage or indexeddb
// also allow disabling caching via settings
// then measure which option could be fastest
import * as Preferences from '../Preferences/Preferences.ts'
import * as GetColorThemeCssCachedLocalStorage from '../GetColorThemeCssCachedLocalStorage/GetColorThemeCssCachedLocalStorage.ts'
import * as GetColorThemeCssCachedIndexedDb from '../GetColorThemeCssCachedIndexedDb/GetColorThemeCssCachedIndexedDb.ts'
import * as GetColorThemeCssCachedNoop from '../GetColorThemeCssCachedNoop/GetColorThemeCssCachedNoop.ts'

const getCacheFn = (config) => {
  switch (config) {
    case 'localStorage':
      return GetColorThemeCssCachedLocalStorage
    case 'indexedDb':
      return GetColorThemeCssCachedIndexedDb
    default:
      return GetColorThemeCssCachedNoop
  }
}

export const getColorThemeCssCached = async (colorThemeId, getData) => {
  const config = await Preferences.get('colorTheme.cache')
  const module = await getCacheFn(config)
  const cachedData = await module.get(colorThemeId)
  if (cachedData) {
    return cachedData
  }
  const newData = await getData(colorThemeId)
  await module.set(colorThemeId, newData)
  return newData
}
