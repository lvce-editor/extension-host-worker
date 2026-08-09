import { MessagePortRpcParent, type Rpc, WebSocketRpcParent } from '@lvce-editor/rpc'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

interface CreateRpcBaseOptions {
  readonly commandMap?: Record<string, unknown>
}

interface CreateDeclaredRpcOptions extends CreateRpcBaseOptions {
  readonly id: string
}

interface CreateLegacyRpcOptions extends CreateRpcBaseOptions {
  readonly contentSecurityPolicy?: readonly string[] | string
  readonly name?: string
  readonly url: string
}

export type CreateRpcOptions = CreateDeclaredRpcOptions | CreateLegacyRpcOptions

export interface CreateNodeRpcOptions {
  readonly id: string
  readonly legacyName?: string
  readonly legacyPath?: string
}

interface ResolvedRpcOptions {
  readonly contentSecurityPolicy: readonly string[] | string
  readonly name: string
  readonly url: string
}

const resolveRpcOptions = async (options: CreateRpcOptions): Promise<ResolvedRpcOptions> => {
  if ('id' in options && options.id) {
    const info = (await ExtensionManagementWorker.invoke('Extensions.getRpcInfo', options.id)) as ResolvedRpcOptions
    return {
      contentSecurityPolicy: info.contentSecurityPolicy || '',
      name: info.name || '',
      url: info.url,
    }
  }
  if ('url' in options && options.url) {
    return {
      contentSecurityPolicy: options.contentSecurityPolicy || '',
      name: options.name || '',
      url: options.url,
    }
  }
  throw new TypeError('createRpc requires an id or url')
}

const sendMessagePortToWebWorker = async (
  port: MessagePort,
  contentSecurityPolicy: readonly string[] | string,
  name: string,
  url: string,
): Promise<void> => {
  await ExtensionManagementWorker.invokeAndTransfer('Extensions.createWebViewWorkerRpc2', { contentSecurityPolicy, name, url }, port)
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

export const createRpc = async (options: CreateRpcOptions): Promise<Rpc> => {
  const { commandMap = {} } = options
  const { contentSecurityPolicy, name, url } = await resolveRpcOptions(options)
  return createMessagePortRpc(commandMap, (port) => sendMessagePortToWebWorker(port, contentSecurityPolicy, name, url))
}

interface WebSocketConnectionInfo {
  readonly protocols: string[]
  readonly type: 'websocket'
  readonly url: string
}

interface MessagePortConnectionInfo {
  readonly type: 'message-port'
}

interface LegacyProxyConnectionInfo {
  readonly type: 'legacy-proxy'
}

interface OldLegacyProxyConnectionInfo {
  readonly name: string
  readonly path: string
  readonly type: 'old-legacy-proxy'
}

type NodeRpcConnectionInfo = LegacyProxyConnectionInfo | MessagePortConnectionInfo | OldLegacyProxyConnectionInfo | WebSocketConnectionInfo

const isMissingCommand = (error: unknown, command: string): boolean => {
  return error instanceof Error && error.message.includes(command) && /command not found|not found/i.test(error.message)
}

const getNodeRpcConnection = async ({ id, legacyName = '', legacyPath }: CreateNodeRpcOptions): Promise<NodeRpcConnectionInfo> => {
  if (!id) {
    throw new TypeError('createNodeRpc requires an id')
  }
  try {
    const connectionInfo = (await ExtensionManagementWorker.invoke('Extensions.createNodeRpcConnection', id)) as NodeRpcConnectionInfo
    return connectionInfo
  } catch (error) {
    if (!isMissingCommand(error, 'Extensions.createNodeRpcConnection')) {
      throw error
    }
    if (legacyPath) {
      return { name: legacyName, path: legacyPath, type: 'old-legacy-proxy' }
    }
    const { name, path } = (await ExtensionManagementWorker.invoke('Extensions.getNodeRpcInfo', id)) as {
      readonly name: string
      readonly path: string
    }
    return { name, path, type: 'old-legacy-proxy' }
  }
}

const createProxyRpc = (invoke: (method: string, ...params: readonly any[]) => Promise<any>, dispose: () => Promise<void>): Rpc => {
  return {
    dispose,
    invoke,
    invokeAndTransfer: invoke,
    send(method: string, ...params: readonly any[]): void {
      void invoke(method, ...params)
    },
  }
}

const createLegacyProxyRpc = async (id: string): Promise<Rpc> => {
  const rpcId = await ExtensionManagementWorker.invoke('Extensions.createLegacyNodeRpc', id)
  return createProxyRpc(
    (method, ...params) => ExtensionManagementWorker.invoke('Extensions.invokeLegacyNodeRpc', rpcId, method, ...params),
    () => ExtensionManagementWorker.invoke('Extensions.disposeLegacyNodeRpc', rpcId) as Promise<void>,
  )
}

const createOldLegacyProxyRpc = async (name: string, path: string): Promise<Rpc> => {
  const rpcId = await ExtensionManagementWorker.invoke('Extensions.executeCommand', 'ExtensionNodeRpc.create', name, path)
  return createProxyRpc(
    (method, ...params) => ExtensionManagementWorker.invoke('Extensions.executeCommand', 'ExtensionNodeRpc.invoke', rpcId, method, ...params),
    () => ExtensionManagementWorker.invoke('Extensions.executeCommand', 'ExtensionNodeRpc.dispose', rpcId) as Promise<void>,
  )
}

export const createNodeRpc = async (options: CreateNodeRpcOptions): Promise<Rpc> => {
  const { id } = options
  const connectionInfo = await getNodeRpcConnection(options)
  if (connectionInfo.type === 'message-port') {
    return createMessagePortRpc({}, (port) => ExtensionManagementWorker.invokeAndTransfer('Extensions.createNodeRpcMessagePort', id, port))
  }
  if (connectionInfo.type === 'legacy-proxy') {
    return createLegacyProxyRpc(id)
  }
  if (connectionInfo.type === 'old-legacy-proxy') {
    return createOldLegacyProxyRpc(connectionInfo.name, connectionInfo.path)
  }
  const { protocols, url } = connectionInfo
  const webSocket = new WebSocket(url, protocols)
  return WebSocketRpcParent.create({
    commandMap: {},
    webSocket,
  })
}
