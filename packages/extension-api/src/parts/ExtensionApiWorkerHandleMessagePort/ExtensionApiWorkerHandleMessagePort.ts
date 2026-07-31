import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import * as CoreExtensionApiCommandMap from '../CoreExtensionApiCommandMap/CoreExtensionApiCommandMap.ts'
import * as ExtensionApiCommandRegistry from '../ExtensionApiCommandRegistry/ExtensionApiCommandRegistry.ts'

const getCommandMap = (): ExtensionApiCommandRegistry.ExtensionApiCommandMap => {
  return {
    ...CoreExtensionApiCommandMap.commandMap,
    ...ExtensionApiCommandRegistry.getCommandMap(),
    async initialize(type: string, port: MessagePort): Promise<void> {
      if (type !== 'message-port') {
        throw new Error(`unsupported initialize type ${type}`)
      }
      await handleExtensionManagementMessagePort(port)
    },
  }
}

export const handleExtensionManagementMessagePort = async (port: MessagePort): Promise<void> => {
  await PlainMessagePortRpc.create({
    commandMap: getCommandMap(),
    isMessagePortOpen: true,
    messagePort: port,
  })
}
