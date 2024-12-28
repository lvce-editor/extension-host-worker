import * as IframeWorkerUrl from '../IframeWorkerUrl/IframeWorkerUrl.ts'
import * as IsProduction from '../IsProduction/IsProduction.ts'
import * as Preferences from '../Preferences/Preferences.ts'

export const getConfiguredIframeWorkerUrl = async () => {
  let configuredWorkerUrl = (await Preferences.get('develop.iframeWorkerPath')) || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || IframeWorkerUrl.iframeWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = IframeWorkerUrl.iframeWorkerUrl
  }
  return configuredWorkerUrl
}
