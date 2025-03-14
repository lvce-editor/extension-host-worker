import { MessagePortRpcParent, type Rpc } from '@lvce-editor/rpc'
import * as Assert from '../Assert/Assert.ts'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.ts'
import * as RendererWorkerIpcParentType from '../RendererWorkerIpcParentType/RendererWorkerIpcParentType.ts'
import * as ParentRpc from '../Rpc/Rpc.ts'

const sendPort = async ({ url, name, port }: { url: string; name: string; port: MessagePort }): Promise<void> => {
  await ParentRpc.invokeAndTransfer('IpcParent.create', {
    method: RendererWorkerIpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url,
    name,
    raw: true,
    port,
  })
}

export const create = async ({ url, name, commandMap }: { url: string; name: string; commandMap: any }): Promise<Rpc> => {
  Assert.string(url)
  Assert.string(name)
  const { port1, port2 } = GetPortTuple.getPortTuple()
  const rpcPromise = MessagePortRpcParent.create({
    messagePort: port2,
    isMessagePortOpen: true,
    commandMap,
  })
  // TODO rpc module should start port
  port2.start()
  await sendPort({ url, name, port: port1 })
  const rpc = await rpcPromise
  return rpc
}
