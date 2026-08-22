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
}

interface ResolvedRpcOptions {
  readonly contentSecurityPolicy: readonly string[] | string
  readonly name: string
  readonly traceId?: string
  readonly url: string
}

const resolveRpcOptions = async (options: CreateRpcOptions): Promise<ResolvedRpcOptions> => {
  if ('id' in options && options.id) {
    const info = (await ExtensionManagementWorker.invoke('Extensions.getRpcInfo', options.id)) as ResolvedRpcOptions
    return {
      contentSecurityPolicy: info.contentSecurityPolicy || '',
      name: info.name || '',
      traceId: options.id,
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
  traceId: string | undefined,
  url: string,
): Promise<void> => {
  await ExtensionManagementWorker.invokeAndTransfer(
    'Extensions.createWebViewWorkerRpc2',
    { contentSecurityPolicy, name, ...(traceId && { traceId }), url },
    port,
  )
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
  const { contentSecurityPolicy, name, traceId, url } = await resolveRpcOptions(options)
  return createMessagePortRpc(commandMap, (port) => sendMessagePortToWebWorker(port, contentSecurityPolicy, name, traceId, url))
}

interface WebSocketConnectionInfo {
  readonly protocols: string[]
  readonly type: 'websocket'
  readonly url: string
}

interface MessagePortConnectionInfo {
  readonly type: 'message-port'
}

type NodeRpcConnectionInfo = MessagePortConnectionInfo | WebSocketConnectionInfo

const getNodeRpcConnection = async ({ id }: CreateNodeRpcOptions): Promise<NodeRpcConnectionInfo> => {
  if (!id) {
    throw new TypeError('createNodeRpc requires an id')
  }
  return ExtensionManagementWorker.invoke('Extensions.createNodeRpcConnection', id) as Promise<NodeRpcConnectionInfo>
}

export const createNodeRpc = async (options: CreateNodeRpcOptions): Promise<Rpc> => {
  const { id } = options
  const connectionInfo = await getNodeRpcConnection(options)
  if (connectionInfo.type === 'message-port') {
    return createMessagePortRpc({}, (port) => ExtensionManagementWorker.invokeAndTransfer('Extensions.createNodeRpcMessagePort', id, port))
  }
  const { protocols, url } = connectionInfo
  const webSocket = new WebSocket(url, protocols)
  return WebSocketRpcParent.create({
    commandMap: {},
    webSocket,
  })
}
