import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as Id from '../Id/Id.js'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as IsProduction from '../IsProduction/IsProduction.ts'
import * as Preferences from '../Preferences/Preferences.ts'
import * as IframeWorkerUrl from '../IframeWorkerUrl/IframeWorkerUrl.ts'

const getConfiguredWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.iframeWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || IframeWorkerUrl.iframeWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = IframeWorkerUrl.iframeWorkerUrl
  }
  return configuredWorkerUrl
}

export const launchIframeWorker = async () => {
  const configuredWorkerUrl = getConfiguredWorkerUrl()
  const name = 'Iframe Worker'
  const id = Id.create()
  let ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: configuredWorkerUrl,
    id,
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
