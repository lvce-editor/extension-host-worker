import { executeCommand, getCommandRegistrySnapshot } from '../CommandRegistry/CommandRegistry.ts'
import { executeCompletionProvider, executeResolveCompletionItemProvider, getCompletionProviderRegistrySnapshot } from '../Completion/Completion.ts'
import { executeDiagnosticProvider, getDiagnosticProviderRegistrySnapshot } from '../Diagnostic/Diagnostic.ts'
import { executeFormattingProvider, getFormattingProviderRegistrySnapshot } from '../Formatting/Formatting.ts'
import { getStatusBarItems } from '../GetStatusBarItems/GetStatusBarItems.ts'
import { executeHoverProvider, getHoverProviderRegistrySnapshot } from '../Hover/Hover.ts'
import { getOutputChannelRegistrySnapshot } from '../OutputChannel/OutputChannel.ts'
import {
  executeSourceControlAcceptInput,
  executeSourceControlAdd,
  executeSourceControlDiscard,
  executeSourceControlGenerateCommitMessage,
  executeSourceControlGetChangedFiles,
  executeSourceControlGetFeatures,
  executeSourceControlGetFileBefore,
  executeSourceControlGetFileDecorations,
  executeSourceControlGetGroups,
  executeSourceControlIsActive,
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
  'ExtensionApi.executeSourceControlAcceptInput': executeSourceControlAcceptInput,
  'ExtensionApi.executeSourceControlAdd': executeSourceControlAdd,
  'ExtensionApi.executeSourceControlDiscard': executeSourceControlDiscard,
  'ExtensionApi.executeSourceControlGenerateCommitMessage': executeSourceControlGenerateCommitMessage,
  'ExtensionApi.executeSourceControlGetChangedFiles': executeSourceControlGetChangedFiles,
  'ExtensionApi.executeSourceControlGetFeatures': executeSourceControlGetFeatures,
  'ExtensionApi.executeSourceControlGetFileBefore': executeSourceControlGetFileBefore,
  'ExtensionApi.executeSourceControlGetFileDecorations': executeSourceControlGetFileDecorations,
  'ExtensionApi.executeSourceControlGetGroups': executeSourceControlGetGroups,
  'ExtensionApi.executeSourceControlIsActive': executeSourceControlIsActive,
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
}
