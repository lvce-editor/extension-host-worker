import * as CoreExtensionApiCommandMap from '../CoreExtensionApiCommandMap/CoreExtensionApiCommandMap.ts'
import * as ExtensionApiCommandRegistry from '../ExtensionApiCommandRegistry/ExtensionApiCommandRegistry.ts'
import { handleExtensionManagementMessagePort } from '../ExtensionApiWorkerHandleMessagePort/ExtensionApiWorkerHandleMessagePort.ts'

export const getCommandMap = (): ExtensionApiCommandRegistry.ExtensionApiCommandMap => {
  return {
    ...CoreExtensionApiCommandMap.commandMap,
    ...ExtensionApiCommandRegistry.getCommandMap(),
    'HandleMessagePort.handleExtensionManagementMessagePort': handleExtensionManagementMessagePort,
    async initialize(type: string, port: MessagePort): Promise<void> {
      if (type !== 'message-port') {
        throw new Error(`unsupported initialize type ${type}`)
      }
      await handleExtensionManagementMessagePort(port)
    },
  }
}
