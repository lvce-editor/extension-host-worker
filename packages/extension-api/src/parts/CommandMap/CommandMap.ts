import { getStatusBarItems } from '../GetStatusBarItems/GetStatusBarItems.ts'
import { handleExtensionManagementMessagePort } from '../HandleExtensionManagementMessagePort/HandleExtensionManagementMessagePort.ts'

export const commandMap = {
  'ExtensionApi.getStatusBarItems': getStatusBarItems,
  async initialize(type: string, port: MessagePort): Promise<void> {
    if (type !== 'message-port') {
      throw new Error(`unsupported initialize type ${type}`)
    }
    await handleExtensionManagementMessagePort(port)
  },
}
