import { getStatusBarItems } from '../GetStatusBarItems/GetStatusBarItems.ts'

export const commandMap = {
  'ExtensionApi.getStatusBarItems': getStatusBarItems,
  async initialize(type: string, port: MessagePort): Promise<void> {
    if (type !== 'message-port') {
      throw new Error(`unsupported initialize type ${type}`)
    }
    const { handleExtensionManagementMessagePort } = await import(
      '../ExtensionApiWorkerHandleMessagePort/ExtensionApiWorkerHandleMessagePort.ts'
    )
    await handleExtensionManagementMessagePort(port)
  },
}
