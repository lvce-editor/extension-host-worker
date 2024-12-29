import * as GetConfiguredIframeWorkerUrl from '../GetConfiguredIframeWorkerUrl/GetConfiguredIframeWorkerUrl.ts'
import * as Id from '../Id/Id.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'

export const launchIframeWorker = async () => {
  const configuredWorkerUrl = GetConfiguredIframeWorkerUrl.getConfiguredIframeWorkerUrl()
  const name = 'Iframe Worker'
  const id = Id.create()
  const rpc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: configuredWorkerUrl,
    id,
  })
  return rpc
}
