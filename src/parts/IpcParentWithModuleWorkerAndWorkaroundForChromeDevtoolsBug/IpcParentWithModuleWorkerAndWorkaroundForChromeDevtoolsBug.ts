import { IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug } from '@lvce-editor/ipc'
import * as Assert from '../Assert/Assert.ts'
import * as RendererWorkerIpcParentType from '../RendererWorkerIpcParentType/RendererWorkerIpcParentType.ts'
import * as Rpc from '../Rpc/Rpc.ts'

const sendPort = async ({ port, name, url }: { port: MessagePort; name: string; url: string }) => {
  await Rpc.invokeAndTransfer('IpcParent.create', {
    method: RendererWorkerIpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url,
    name,
    raw: true,
    port,
  })
}

export const create = async ({ url, name }) => {
  Assert.string(url)
  Assert.string(name)
  const port = await IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.create({
    name,
    url,
    sendPort,
  })
  return port
}

export const wrap = (port) => {
  return IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.wrap(port)
}
