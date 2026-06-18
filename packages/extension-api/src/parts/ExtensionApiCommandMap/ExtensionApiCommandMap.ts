import { executeCommand, getCommandRegistrySnapshot } from '../CommandRegistry/CommandRegistry.ts'
import { executeCompletionProvider, executeResolveCompletionItemProvider, getCompletionProviderRegistrySnapshot } from '../Completion/Completion.ts'
import { executeDiagnosticProvider, getDiagnosticProviderRegistrySnapshot } from '../Diagnostic/Diagnostic.ts'
import { executeFormattingProvider, getFormattingProviderRegistrySnapshot } from '../Formatting/Formatting.ts'
import { getStatusBarItems } from '../GetStatusBarItems/GetStatusBarItems.ts'
import { executeHoverProvider, getHoverProviderRegistrySnapshot } from '../Hover/Hover.ts'
import { getOutputChannelRegistrySnapshot } from '../OutputChannel/OutputChannel.ts'
import {
  createViewInstance,
  dispatchViewEvent,
  disposeViewInstance,
  executeViewProvider,
  getViewRegistrySnapshot,
  saveViewInstanceState,
} from '../ViewRegistry/ViewRegistry.ts'

export const commandMap = {
  'ExtensionApi.createViewInstance': createViewInstance,
  'ExtensionApi.dispatchViewEvent': dispatchViewEvent,
  'ExtensionApi.disposeViewInstance': disposeViewInstance,
  'ExtensionApi.executeCommand': executeCommand,
  'ExtensionApi.executeCompletionProvider': executeCompletionProvider,
  'ExtensionApi.executeDiagnosticProvider': executeDiagnosticProvider,
  'ExtensionApi.executeFormattingProvider': executeFormattingProvider,
  'ExtensionApi.executeHoverProvider': executeHoverProvider,
  'ExtensionApi.executeResolveCompletionItemProvider': executeResolveCompletionItemProvider,
  'ExtensionApi.executeViewProvider': executeViewProvider,
  'ExtensionApi.getCommandRegistrySnapshot': getCommandRegistrySnapshot,
  'ExtensionApi.getCompletionProviderRegistrySnapshot': getCompletionProviderRegistrySnapshot,
  'ExtensionApi.getDiagnosticProviderRegistrySnapshot': getDiagnosticProviderRegistrySnapshot,
  'ExtensionApi.getFormattingProviderRegistrySnapshot': getFormattingProviderRegistrySnapshot,
  'ExtensionApi.getHoverProviderRegistrySnapshot': getHoverProviderRegistrySnapshot,
  'ExtensionApi.getOutputChannelRegistrySnapshot': getOutputChannelRegistrySnapshot,
  'ExtensionApi.getStatusBarItems': getStatusBarItems,
  'ExtensionApi.getViewRegistrySnapshot': getViewRegistrySnapshot,
  'ExtensionApi.saveViewInstanceState': saveViewInstanceState,
}
