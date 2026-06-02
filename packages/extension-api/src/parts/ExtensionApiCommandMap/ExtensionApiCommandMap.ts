import { executeCommand, getCommandRegistrySnapshot } from '../Command/Command.ts'
import { executeFormattingProvider, getFormattingProviderRegistrySnapshot } from '../Formatting/Formatting.ts'
import { getStatusBarItems } from '../GetStatusBarItems/GetStatusBarItems.ts'

export const commandMap = {
  'ExtensionApi.executeCommand': executeCommand,
  'ExtensionApi.executeFormattingProvider': executeFormattingProvider,
  'ExtensionApi.getCommandRegistrySnapshot': getCommandRegistrySnapshot,
  'ExtensionApi.getFormattingProviderRegistrySnapshot': getFormattingProviderRegistrySnapshot,
  'ExtensionApi.getStatusBarItems': getStatusBarItems,
}
