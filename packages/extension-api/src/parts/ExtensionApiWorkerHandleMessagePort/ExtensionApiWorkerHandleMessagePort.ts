import { MessagePortRpcClient } from '@lvce-editor/rpc'
import * as ExtensionApiCommandMap from '../ExtensionApiCommandMap/ExtensionApiCommandMap.ts'

const commandMap = {
  ...ExtensionApiCommandMap.commandMap,
  async initialize(type: string, port: MessagePort): Promise<void> {
    if (type !== 'message-port') {
      throw new Error(`unsupported initialize type ${type}`)
    }
    await handleExtensionManagementMessagePort(port)
  },
}

export const handleExtensionManagementMessagePort = async (port: MessagePort): Promise<void> => {
  await MessagePortRpcClient.create({
    commandMap,
    messagePort: port,
  })
}
