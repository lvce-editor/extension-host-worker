export { activate } from './parts/Activation/Activation.ts'
export { executeCommand } from './parts/ExecuteCommand/ExecuteCommand.ts'
export { showQuickPick } from './parts/QuickPick/QuickPick.ts'
export { getPreference, setPreference } from './parts/Preferences/Preferences.ts'
export { registerCommand } from './parts/CommandRegistry/CommandRegistry.ts'
export {
  executeCompletionProvider,
  executeResolveCompletionItemProvider,
  getCompletionProviderRegistrySnapshot,
  registerCompletionProvider,
  resetCompletionProviderRegistry,
} from './parts/Completion/Completion.ts'
export {
  executeDiagnosticProvider,
  getDiagnosticProviderRegistrySnapshot,
  registerDiagnosticProvider,
  resetDiagnosticProviderRegistry,
} from './parts/Diagnostic/Diagnostic.ts'
export {
  executeFormattingProvider,
  getFormattingProviderRegistrySnapshot,
  registerFormattingProvider,
  resetFormattingProviderRegistry,
} from './parts/Formatting/Formatting.ts'
export { exists, mkdir, readDirWithFileTypes, readFile, remove, writeFile } from './parts/FileSystem/FileSystem.ts'
export { executeHoverProvider, getHoverProviderRegistrySnapshot, registerHoverProvider, resetHoverProviderRegistry } from './parts/Hover/Hover.ts'
export {
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
  registerSourceControlProvider,
  resetSourceControlProviderRegistry,
} from './parts/SourceControl/SourceControl.ts'
export {
  createViewInstance,
  dispatchViewEvent,
  disposeViewInstance,
  executeViewProvider,
  getViewRegistrySnapshot,
  renderViewInstance,
  registerView,
  resetViewRegistry,
  saveViewInstanceState,
} from './parts/ViewRegistry/ViewRegistry.ts'
export { createOutputChannel, getOutputChannelRegistrySnapshot, resetOutputChannelRegistry } from './parts/OutputChannel/OutputChannel.ts'
export {
  getStatusBarItemProviderRegistrySnapshot,
  registerStatusBarItemProvider,
  resetStatusBarItemProviderRegistry,
} from './parts/StatusBar/StatusBar.ts'
export type {
  RegisteredView,
  View,
  ViewAction,
  ViewContext,
  ViewEvent,
  ViewKind,
  MenuEntry,
  ViewRegistrySnapshot,
  ViewRenderResult,
  VirtualDomViewInstance,
} from './parts/View/View.ts'
export { handleExtensionManagementMessagePort } from './parts/HandleExtensionManagementMessagePort/HandleExtensionManagementMessagePort.ts'
export type { Command } from './parts/Command/Command.ts'
export type { CommandCallback } from './parts/CommandCallback/CommandCallback.ts'
export type { CommandRegistrySnapshot } from './parts/CommandRegistrySnapshot/CommandRegistrySnapshot.ts'
export type {
  CompletionItem,
  CompletionProvider,
  CompletionProviderRegistrySnapshot,
  RegisteredCompletionProvider,
} from './parts/Completion/Completion.ts'
export type {
  Diagnostic,
  DiagnosticProvider,
  DiagnosticProviderRegistrySnapshot,
  RegisteredDiagnosticProvider,
} from './parts/Diagnostic/Diagnostic.ts'
export type { Disposable } from './parts/Disposable/Disposable.ts'
export type {
  FormattingEdit,
  FormattingProvider,
  FormattingProviderRegistrySnapshot,
  RegisteredFormattingProvider,
} from './parts/Formatting/Formatting.ts'
export type { FileSystemDirent } from './parts/FileSystem/FileSystem.ts'
export type { HandleExtensionManagementMessagePortOptions } from './parts/HandleExtensionManagementMessagePort/HandleExtensionManagementMessagePort.ts'
export type { HoverProvider, HoverProviderRegistrySnapshot, HoverResult, RegisteredHoverProvider } from './parts/Hover/Hover.ts'
export type { OutputChannel } from './parts/OutputChannelHandle/OutputChannelHandle.ts'
export type { OutputChannelRegistrySnapshot } from './parts/OutputChannelRegistrySnapshot/OutputChannelRegistrySnapshot.ts'
export type { RegisteredOutputChannel } from './parts/RegisteredOutputChannel/RegisteredOutputChannel.ts'
export type { QuickPickItem } from './parts/QuickPickItem/QuickPickItem.ts'
export type {
  RegisteredSourceControlProvider,
  SourceControlProvider,
  SourceControlProviderRegistrySnapshot,
} from './parts/SourceControl/SourceControl.ts'
export type { ShowQuickPickOptions } from './parts/ShowQuickPickOptions/ShowQuickPickOptions.ts'
export type {
  StatusBarItem,
  StatusBarItemProvider,
  StatusBarItemProviderHandle,
  StatusBarItemProviderRegistrySnapshot,
} from './parts/StatusBar/StatusBar.ts'
