import { handleExtensionManagementMessagePort } from '../ExtensionApiWorkerHandleMessagePort/ExtensionApiWorkerHandleMessagePort.ts'
import { commandMap as extensionApiCommandMap } from '../ExtensionApiCommandMap/ExtensionApiCommandMap.ts'

export const commandMap = {
  ...extensionApiCommandMap,
  async initialize(type: string, port: MessagePort): Promise<void> {
    if (type !== 'message-port') {
      throw new Error(`unsupported initialize type ${type}`)
    }
    await handleExtensionManagementMessagePort(port)
  },
}
