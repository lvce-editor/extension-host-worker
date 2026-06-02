import { executeCommand, getCommandRegistrySnapshot } from '../CommandRegistry/CommandRegistry.ts'
import { executeCompletionProvider, executeResolveCompletionItemProvider, getCompletionProviderRegistrySnapshot } from '../Completion/Completion.ts'
import { executeDiagnosticProvider, getDiagnosticProviderRegistrySnapshot } from '../Diagnostic/Diagnostic.ts'
import { executeFormattingProvider, getFormattingProviderRegistrySnapshot } from '../Formatting/Formatting.ts'
import { getStatusBarItems } from '../GetStatusBarItems/GetStatusBarItems.ts'
import { executeHoverProvider, getHoverProviderRegistrySnapshot } from '../Hover/Hover.ts'

export const commandMap = {
  'ExtensionApi.executeCommand': executeCommand,
  'ExtensionApi.executeCompletionProvider': executeCompletionProvider,
  'ExtensionApi.executeDiagnosticProvider': executeDiagnosticProvider,
  'ExtensionApi.executeFormattingProvider': executeFormattingProvider,
  'ExtensionApi.executeHoverProvider': executeHoverProvider,
  'ExtensionApi.executeResolveCompletionItemProvider': executeResolveCompletionItemProvider,
  'ExtensionApi.getCommandRegistrySnapshot': getCommandRegistrySnapshot,
  'ExtensionApi.getCompletionProviderRegistrySnapshot': getCompletionProviderRegistrySnapshot,
  'ExtensionApi.getDiagnosticProviderRegistrySnapshot': getDiagnosticProviderRegistrySnapshot,
  'ExtensionApi.getFormattingProviderRegistrySnapshot': getFormattingProviderRegistrySnapshot,
  'ExtensionApi.getHoverProviderRegistrySnapshot': getHoverProviderRegistrySnapshot,
  'ExtensionApi.getStatusBarItems': getStatusBarItems,
}
