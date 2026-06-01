import { commandMap as extensionApiCommandMap } from '../CommandMap/CommandMap.ts'
import { handleExtensionManagementMessagePort } from '../ExtensionApiWorkerHandleMessagePort/ExtensionApiWorkerHandleMessagePort.ts'

export const commandMap = {
  ...extensionApiCommandMap,
  'HandleMessagePort.handleExtensionManagementMessagePort': handleExtensionManagementMessagePort,
}
