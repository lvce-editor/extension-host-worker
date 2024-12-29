import { IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug } from '@lvce-editor/ipc'
import * as Assert from '../Assert/Assert.ts'
import * as RendererWorkerIpcParentType from '../RendererWorkerIpcParentType/RendererWorkerIpcParentType.ts'
import * as Rpc from '../Rpc/Rpc.ts'

const sendPort = async ({ url, name, port }: { url: string; name: string; port: MessagePort }): Promise<void> => {
  await Rpc.invokeAndTransfer('IpcParent.create', {
    method: RendererWorkerIpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url,
    name,
    raw: true,
    port,
  })
}

export const create = async ({ url, name }: { url: string; name: string }): Promise<MessagePort> => {
  Assert.string(url)
  Assert.string(name)
  const port2 = IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.create({
    url,
    name,
    sendPort,
  })
  // @ts-ignore
  return port2
}

export const wrap = (port: MessagePort) => {
  // @ts-ignore
  const wrapped = IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.wrap(port)
  return {
    wrapped,
    set onmessage(listener) {
      this.wrapped.addEventListener('message', (event) => {
        // @ts-ignore
        listener(event.data)
      })
    },
    send(message) {
      this.wrapped.send(message)
    },
    sendAndTransfer(message, transfer) {
      this.wrapped.sendAndTransfer(message, transfer)
    },
  }
}
