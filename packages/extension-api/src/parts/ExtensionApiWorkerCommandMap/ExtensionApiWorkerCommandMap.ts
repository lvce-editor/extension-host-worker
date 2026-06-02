import { commandMap as extensionApiCommandMap } from '../ExtensionApiCommandMap/ExtensionApiCommandMap.ts'
import { handleExtensionManagementMessagePort } from '../ExtensionApiWorkerHandleMessagePort/ExtensionApiWorkerHandleMessagePort.ts'

export const commandMap = {
  ...extensionApiCommandMap,
  'HandleMessagePort.handleExtensionManagementMessagePort': handleExtensionManagementMessagePort,
  async initialize(type: string, port: MessagePort): Promise<void> {
    if (type !== 'message-port') {
      throw new Error(`unsupported initialize type ${type}`)
    }
    await handleExtensionManagementMessagePort(port)
  },
}
