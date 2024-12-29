import { MessagePortRpcClient } from '@lvce-editor/rpc'

export const handleMessagePort = async (port: MessagePort) => {
  await MessagePortRpcClient.create({
    messagePort: port,
    commandMap: {},
  })
}
