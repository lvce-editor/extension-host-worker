import { executeCommand, getCommandRegistrySnapshot } from '../Command/Command.ts'
import { getStatusBarItems } from '../GetStatusBarItems/GetStatusBarItems.ts'

export const commandMap = {
  'ExtensionApi.executeCommand': executeCommand,
  'ExtensionApi.getCommandRegistrySnapshot': getCommandRegistrySnapshot,
  'ExtensionApi.getStatusBarItems': getStatusBarItems,
}
