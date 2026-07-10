import { LazyTransferMessagePortRpcParent, ModuleWorkerRpcParent, type Rpc } from '@lvce-editor/rpc'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export interface CreateRpcOptions {
  readonly commandMap?: Record<string, unknown>
  readonly name?: string
  readonly url: string
}

export interface CreateNodeRpcOptions {
  readonly name?: string
  readonly path: string
}

const sendMessagePortToNode = async (port: MessagePort): Promise<void> => {
  await ExtensionManagementWorker.invokeAndTransfer(
    'Extensions.sendMessagePortToElectron',
    port,
    'HandleMessagePortForExtensionHostHelperProcess.handleMessagePortForExtensionHostHelperProcess',
  )
}

export const createRpc = async ({ commandMap = {}, name = '', url }: CreateRpcOptions): Promise<Rpc> => {
  return ModuleWorkerRpcParent.create({
    commandMap,
    name,
    url,
  })
}

export const createNodeRpc = async ({ path }: CreateNodeRpcOptions): Promise<Rpc> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: sendMessagePortToNode,
  })
  await rpc.invoke('LoadFile.loadFile', path)
  return rpc
}
