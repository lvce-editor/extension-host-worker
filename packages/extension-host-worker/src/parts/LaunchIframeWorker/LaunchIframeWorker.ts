import * as GetConfiguredIframeWorkerUrl from '../GetConfiguredIframeWorkerUrl/GetConfiguredIframeWorkerUrl.ts'
import * as Id from '../Id/Id.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'

const commandMap = {
  // TODO
}

export const launchIframeWorker = async () => {
  const configuredWorkerUrl = await GetConfiguredIframeWorkerUrl.getConfiguredIframeWorkerUrl()
  const name = 'Iframe Worker'
  const id = Id.create()
  const rpc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: configuredWorkerUrl,
    id,
    commandMap,
  })
  return rpc
}
