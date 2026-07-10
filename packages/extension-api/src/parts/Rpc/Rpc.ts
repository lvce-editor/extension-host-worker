import { LazyTransferMessagePortRpcParent, type Rpc } from '@lvce-editor/rpc'
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

const sendMessagePortToWebWorker = async (port: MessagePort, name: string): Promise<void> => {
  await ExtensionManagementWorker.invokeAndTransfer('Extensions.createWebViewWorkerRpc', { name }, port)
}

export const createRpc = async ({ commandMap = {}, name = '', url }: CreateRpcOptions): Promise<Rpc> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap,
    send(port): Promise<void> {
      return sendMessagePortToWebWorker(port, name)
    },
  })
  await rpc.invoke('LoadFile.loadFile', url)
  return rpc
}

export const createNodeRpc = async ({ path }: CreateNodeRpcOptions): Promise<Rpc> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: sendMessagePortToNode,
  })
  await rpc.invoke('LoadFile.loadFile', path)
  return rpc
}
