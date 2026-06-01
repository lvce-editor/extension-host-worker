import { commandMap as extensionApiCommandMap } from '../ExtensionApiCommandMap/ExtensionApiCommandMap.ts'
import { handleExtensionManagementMessagePort } from '../ExtensionApiWorkerHandleMessagePort/ExtensionApiWorkerHandleMessagePort.ts'

export const commandMap = {
  ...extensionApiCommandMap,
  'HandleMessagePort.handleExtensionManagementMessagePort': handleExtensionManagementMessagePort,
}
