import { MessagePortRpcParent, type Rpc } from '@lvce-editor/rpc'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export interface CreateRpcOptions {
  readonly commandMap?: Record<string, unknown>
  readonly name?: string
  readonly url: string
}

export interface CreateNodeRpcOptions {
  readonly id?: string
  readonly name?: string
  readonly path?: string
}

const sendMessagePortToWebWorker = async (port: MessagePort, name: string, url: string): Promise<void> => {
  await ExtensionManagementWorker.invokeAndTransfer('Extensions.createWebViewWorkerRpc2', { name, url }, port)
}

const createMessagePortRpc = async (commandMap: Record<string, unknown>, send: (port: MessagePort) => Promise<void>): Promise<Rpc> => {
  const { port1, port2 } = new MessageChannel()
  const rpcPromise = MessagePortRpcParent.create({
    commandMap,
    isMessagePortOpen: true,
    messagePort: port2,
  })
  port2.start()
  await send(port1)
  return rpcPromise
}

export const createRpc = async ({ commandMap = {}, name = '', url }: CreateRpcOptions): Promise<Rpc> => {
  return createMessagePortRpc(commandMap, (port) => sendMessagePortToWebWorker(port, name, url))
}

interface ResolvedNodeRpcOptions {
  readonly name: string
  readonly path: string
}

const resolveNodeRpcOptions = async ({ id, name = '', path }: CreateNodeRpcOptions): Promise<ResolvedNodeRpcOptions> => {
  if (id) {
    return ExtensionManagementWorker.invoke('Extensions.getNodeRpcInfo', id) as Promise<ResolvedNodeRpcOptions>
  }
  if (path) {
    return { name, path }
  }
  throw new TypeError('createNodeRpc requires an id or path')
}

export const createNodeRpc = async (options: CreateNodeRpcOptions): Promise<Rpc> => {
  const { name, path } = await resolveNodeRpcOptions(options)
  const rpcId = await ExtensionManagementWorker.invoke('Extensions.executeCommand', 'ExtensionNodeRpc.create', name, path)
  const invoke = (method: string, ...params: readonly any[]): Promise<any> => {
    return ExtensionManagementWorker.invoke('Extensions.executeCommand', 'ExtensionNodeRpc.invoke', rpcId, method, ...params)
  }
  return {
    async dispose(): Promise<void> {
      await ExtensionManagementWorker.invoke('Extensions.executeCommand', 'ExtensionNodeRpc.dispose', rpcId)
    },
    invoke,
    invokeAndTransfer: invoke,
    send(method: string, ...params: readonly any[]): void {
      void invoke(method, ...params)
    },
  }
}
