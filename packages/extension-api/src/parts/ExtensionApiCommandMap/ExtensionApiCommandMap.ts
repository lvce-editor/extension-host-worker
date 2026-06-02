import { executeCommand, getCommandRegistrySnapshot } from '../CommandRegistry/CommandRegistry.ts'
import { executeCompletionProvider, executeResolveCompletionItemProvider, getCompletionProviderRegistrySnapshot } from '../Completion/Completion.ts'
import { executeFormattingProvider, getFormattingProviderRegistrySnapshot } from '../Formatting/Formatting.ts'
import { getStatusBarItems } from '../GetStatusBarItems/GetStatusBarItems.ts'

export const commandMap = {
  'ExtensionApi.executeCommand': executeCommand,
  'ExtensionApi.executeCompletionProvider': executeCompletionProvider,
  'ExtensionApi.executeFormattingProvider': executeFormattingProvider,
  'ExtensionApi.executeResolveCompletionItemProvider': executeResolveCompletionItemProvider,
  'ExtensionApi.getCommandRegistrySnapshot': getCommandRegistrySnapshot,
  'ExtensionApi.getCompletionProviderRegistrySnapshot': getCompletionProviderRegistrySnapshot,
  'ExtensionApi.getFormattingProviderRegistrySnapshot': getFormattingProviderRegistrySnapshot,
  'ExtensionApi.getStatusBarItems': getStatusBarItems,
}
