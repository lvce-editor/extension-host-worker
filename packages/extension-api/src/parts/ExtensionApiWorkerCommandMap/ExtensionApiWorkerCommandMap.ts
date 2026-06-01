import { activateExtension } from '../ActivateExtension/ActivateExtension.ts'
import { commandMap as extensionApiCommandMap } from '../CommandMap/CommandMap.ts'
import { handleExtensionManagementMessagePort } from '../ExtensionApiWorkerHandleMessagePort/ExtensionApiWorkerHandleMessagePort.ts'
import { importExtension } from '../ImportExtension/ImportExtension.ts'

export const commandMap = {
  ...extensionApiCommandMap,
  'ExtensionHost.activateExtension3': activateExtension,
  'ExtensionHost.importExtension2': importExtension,
  'HandleMessagePort.handleExtensionManagementMessagePort': handleExtensionManagementMessagePort,
}
