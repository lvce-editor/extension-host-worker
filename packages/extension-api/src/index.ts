export { activate } from './parts/Activation/Activation.ts'
export { getAccessToken, type GetAccessTokenOptions } from './parts/Authentication/Authentication.ts'
export { createElectronWebContentsView } from './parts/ElectronWebContentsView/ElectronWebContentsView.ts'
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
export { exists, mkdir, readDirWithFileTypes, readFile, remove, stat, writeFile } from './parts/FileSystem/FileSystem.ts'
export { confirm, getWorkspaceFolder, getWorkspaceUri, handleWorkspaceRefresh, openUri } from './parts/Host/Host.ts'
export { getJsonSchemas } from './parts/GetJsonSchemas/GetJsonSchemas.ts'
export { executeHoverProvider, getHoverProviderRegistrySnapshot, registerHoverProvider, resetHoverProviderRegistry } from './parts/Hover/Hover.ts'
export { getLanguageServerRegistrySnapshot, registerLanguageServer, resetLanguageServerRegistry } from './parts/LanguageServer/LanguageServer.ts'
export {
  registerBraceCompletionProvider,
  registerClosingTagProvider,
  registerCodeActionsProvider,
  registerCommentProvider,
  registerDefinitionProvider,
  registerImplementationProvider,
  registerReferenceProvider,
  registerRenameProvider,
  registerSelectionProvider,
  registerTabCompletionProvider,
  registerTypeDefinitionProvider,
  resetLanguageProviderRegistry,
} from './parts/LanguageProvider/LanguageProvider.ts'
export type { LanguageProvider } from './parts/LanguageProvider/LanguageProvider.ts'
export {
  executeSourceControlAcceptInput,
  executeSourceControlAdd,
  executeSourceControlDiscard,
  executeSourceControlGenerateCommitMessage,
  executeSourceControlGetBadgeCount,
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
  ViewCommand,
  ViewContext,
  ViewEvent,
  ViewKind,
  MenuEntry,
  ViewRegistrySnapshot,
  ViewRenderResult,
  ViewScrollPosition,
  ViewSelection,
  VirtualDomViewInstance,
} from './parts/View/View.ts'
export { handleExtensionManagementMessagePort } from './parts/HandleExtensionManagementMessagePort/HandleExtensionManagementMessagePort.ts'
export { createNodeRpc, createRpc } from './parts/Rpc/Rpc.ts'
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
  CreateElectronWebContentsViewOptions,
  ElectronWebContentsView,
  ElectronWebContentsViewStats,
} from './parts/ElectronWebContentsView/ElectronWebContentsView.ts'
export type {
  FormattingEdit,
  FormattingProvider,
  FormattingProviderRegistrySnapshot,
  RegisteredFormattingProvider,
} from './parts/Formatting/Formatting.ts'
export type { FileSystemDirent } from './parts/FileSystem/FileSystem.ts'
export type { HandleExtensionManagementMessagePortOptions } from './parts/HandleExtensionManagementMessagePort/HandleExtensionManagementMessagePort.ts'
export type { JsonSchemaContribution } from './parts/JsonSchemaContribution/JsonSchemaContribution.ts'
export type { HoverProvider, HoverProviderRegistrySnapshot, HoverResult, RegisteredHoverProvider } from './parts/Hover/Hover.ts'
export type { LanguageServerOptions, LanguageServerRegistrySnapshot } from './parts/LanguageServer/LanguageServer.ts'
export type { OutputChannel } from './parts/OutputChannelHandle/OutputChannelHandle.ts'
export type { OutputChannelRegistrySnapshot } from './parts/OutputChannelRegistrySnapshot/OutputChannelRegistrySnapshot.ts'
export type { RegisteredOutputChannel } from './parts/RegisteredOutputChannel/RegisteredOutputChannel.ts'
export type { QuickPickItem } from './parts/QuickPickItem/QuickPickItem.ts'
export type { CreateNodeRpcOptions, CreateRpcOptions } from './parts/Rpc/Rpc.ts'
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
