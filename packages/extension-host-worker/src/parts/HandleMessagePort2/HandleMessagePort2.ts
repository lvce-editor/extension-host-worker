import { PlainMessagePortRpcParent } from '@lvce-editor/rpc'
import * as RpcRegistry from '../RpcRegistry/RpcRegistry.ts'

export const handleMessagePort2 = async (port: MessagePort, rpcId?: number) => {
  const rpc = await PlainMessagePortRpcParent.create({
    messagePort: port,
    commandMap: {},
  })
  if (rpcId) {
    RpcRegistry.set(rpcId, rpc)
  }
}
