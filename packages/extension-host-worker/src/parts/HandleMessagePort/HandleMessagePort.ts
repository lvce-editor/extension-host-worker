import { MessagePortRpcClient } from '@lvce-editor/rpc'
import * as RpcRegistry from '../RpcRegistry/RpcRegistry.ts'

export const handleMessagePort = async (port: MessagePort, rpcId?: number) => {
  const rpc = await MessagePortRpcClient.create({
    messagePort: port,
    commandMap: {},
  })
  if (rpcId) {
    RpcRegistry.set(rpcId, rpc)
  }
}
