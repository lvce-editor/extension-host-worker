import { executeCommand, getCommandRegistrySnapshot } from '../CommandRegistry/CommandRegistry.ts'
import { executeCompletionProvider, executeResolveCompletionItemProvider, getCompletionProviderRegistrySnapshot } from '../Completion/Completion.ts'
import { executeDiagnosticProvider, getDiagnosticProviderRegistrySnapshot } from '../Diagnostic/Diagnostic.ts'
import { executeFormattingProvider, getFormattingProviderRegistrySnapshot } from '../Formatting/Formatting.ts'
import { getStatusBarItems } from '../GetStatusBarItems/GetStatusBarItems.ts'
import { executeHoverProvider, getHoverProviderRegistrySnapshot } from '../Hover/Hover.ts'
import { getOutputChannelRegistrySnapshot } from '../OutputChannel/OutputChannel.ts'
import {
  acceptInput as sourceControlAcceptInput,
  add as sourceControlAdd,
  discard as sourceControlDiscard,
  generateCommitMessage as sourceControlGenerateCommitMessage,
  getChangedFiles as sourceControlGetChangedFiles,
  getEnabledProviderIds as sourceControlGetEnabledProviderIds,
  getFeatures as sourceControlGetFeatures,
  getFileBefore as sourceControlGetFileBefore,
  getFileDecorations as sourceControlGetFileDecorations,
  getGroups as sourceControlGetGroups,
  getSourceControlProviderRegistrySnapshot,
} from '../SourceControl/SourceControl.ts'
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
  'ExtensionApi.getSourceControlProviderRegistrySnapshot': getSourceControlProviderRegistrySnapshot,
  'ExtensionApi.getStatusBarItems': getStatusBarItems,
  'ExtensionApi.getViewRegistrySnapshot': getViewRegistrySnapshot,
  'ExtensionApi.saveViewInstanceState': saveViewInstanceState,
  'ExtensionApi.sourceControlAcceptInput': sourceControlAcceptInput,
  'ExtensionApi.sourceControlAdd': sourceControlAdd,
  'ExtensionApi.sourceControlDiscard': sourceControlDiscard,
  'ExtensionApi.sourceControlGenerateCommitMessage': sourceControlGenerateCommitMessage,
  'ExtensionApi.sourceControlGetChangedFiles': sourceControlGetChangedFiles,
  'ExtensionApi.sourceControlGetEnabledProviderIds': sourceControlGetEnabledProviderIds,
  'ExtensionApi.sourceControlGetFeatures': sourceControlGetFeatures,
  'ExtensionApi.sourceControlGetFileBefore': sourceControlGetFileBefore,
  'ExtensionApi.sourceControlGetFileDecorations': sourceControlGetFileDecorations,
  'ExtensionApi.sourceControlGetGroups': sourceControlGetGroups,
}
