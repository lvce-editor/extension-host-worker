import * as ExtensionHostBraceCompletion from '../ExtensionHostBraceCompletion/ExtensionHostBraceCompletion.ts'
import * as ExtensionHostClosingTag from '../ExtensionHostClosingTag/ExtensionHostClosingTag.ts'
import * as ExtensionHostCodeActions from '../ExtensionHostCodeActions/ExtensionHostCodeActions.ts'
import * as ExtensionHostCommand from '../ExtensionHostCommand/ExtensionHostCommand.ts'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as ExtensionHostCompletion from '../ExtensionHostCompletion/ExtensionHostCompletion.ts'
import * as ExtensionHostConfiguration from '../ExtensionHostConfiguration/ExtensionHostConfiguration.ts'
import * as ExtensionHostDebug from '../ExtensionHostDebug/ExtensionHostDebug.ts'
import * as ExtensionHostDefinition from '../ExtensionHostDefinition/ExtensionHostDefinition.ts'
import * as ExtensionHostDiagnostic from '../ExtensionHostDiagnostic/ExtensionHostDiagnostic.ts'
import * as ExtensionHostExtension from '../ExtensionHostExtension/ExtensionHostExtension.ts'
import * as ExtensionHostFileSystem from '../ExtensionHostFileSystem/ExtensionHostFileSystem.ts'
import * as ExtensionHostFormatting from '../ExtensionHostFormatting/ExtensionHostFormatting.ts'
import * as ExtensionHostHover from '../ExtensionHostHover/ExtensionHostHover.ts'
import * as ExtensionHostImplementation from '../ExtensionHostImplementation/ExtensionHostImplementation.ts'
import * as ExtensionHostMockExec from '../ExtensionHostMockExec/ExtensionHostMockExec.ts'
import * as ExtensionHostMockRpc from '../ExtensionHostMockRpc/ExtensionHostMockRpc.ts'
import * as ExtensionHostReference from '../ExtensionHostReference/ExtensionHostReference.ts'
import * as ExtensionHostSelection from '../ExtensionHostSelection/ExtensionHostSelection.ts'
import * as ExtensionHostSourceControl from '../ExtensionHostSourceControl/ExtensionHostSourceControl.ts'
import * as ExtensionHostStatusBar from '../ExtensionHostStatusBar/ExtensionHostStatusBar.ts'
import * as ExtensionHostTabCompletion from '../ExtensionHostTabCompletion/ExtensionHostTabCompletion.ts'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.ts'
import * as ExtensionHostTextSearch from '../ExtensionHostTextSearch/ExtensionHostTextSearch.ts'
import * as ExtensionHostTypeDefinition from '../ExtensionHostTypeDefinition/ExtensionHostTypeDefinition.ts'
import * as ExtensionHostWebView from '../ExtensionHostWebView/ExtensionHostWebView.ts'
import * as ExtensionHostWorkspace from '../ExtensionHostWorkspace/ExtensionHostWorkspace.ts'
import * as HandleBeforeUnload from '../HandleBeforeUnload/HandleBeforeUnload.ts'
import * as HandleMessagePort from '../HandleMessagePort/HandleMessagePort.ts'
import * as SaveState from '../SaveState/SaveState.ts'
import * as ExtensionHostRename from '../ExtensionHostRename/ExtensionHostRename.ts'

export const commandMap = {
  'ExtensionHostRename.executeRenameProvider': ExtensionHostRename.executeRenameProvider,
  'ExtensionHostRename.executeprepareRenameProvider': ExtensionHostRename.executeprepareRenameProvider,
  ['ExtensionHostDebug.evaluate']: ExtensionHostDebug.evaluate,
  ['ExtensionHostDebug.getProperties']: ExtensionHostDebug.getProperties,
  ['ExtensionHostDebug.listProcesses']: ExtensionHostDebug.listProcesses,
  ['ExtensionHostDebug.pause']: ExtensionHostDebug.pause,
  ['ExtensionHostDebug.resume']: ExtensionHostDebug.resume,
  ['ExtensionHostDebug.setPauseOnException']: ExtensionHostDebug.setPauseOnException,
  ['ExtensionHostDebug.setPauseOnExceptions']: ExtensionHostDebug.setPauseOnExceptions,
  ['ExtensionHostDebug.start']: ExtensionHostDebug.start,
  ['ExtensionHostDebug.stepInto']: ExtensionHostDebug.stepInto,
  ['ExtensionHostDebug.stepOut']: ExtensionHostDebug.stepOut,
  ['ExtensionHostDebug.stepOver']: ExtensionHostDebug.stepOver,
  ['ExtensionHostWebView.create']: ExtensionHostWebView.createWebView,
  ['ExtensionHostWebView.dispose']: ExtensionHostWebView.disposeWebView,
  ['ExtensionHostWebView.load']: ExtensionHostWebView.load,
  ['HandleBeforeUnload.handleBeforeUnload']: HandleBeforeUnload.handleBeforeUnload,
  ['HandleMessagePort.handleMessagePort']: HandleMessagePort.handleMessagePort,
  ['SaveState.saveState']: SaveState.saveState,
  [ExtensionHostCommandType.BraceCompletionExecuteBraceCompletionProvider]: ExtensionHostBraceCompletion.executeBraceCompletionProvider,
  [ExtensionHostCommandType.ClosingTagExecuteClosingTagProvider]: ExtensionHostClosingTag.executeClosingTagProvider,
  [ExtensionHostCommandType.CommandExecute]: ExtensionHostCommand.executeCommand,
  [ExtensionHostCommandType.CompletionExecute]: ExtensionHostCompletion.executeCompletionProvider,
  [ExtensionHostCommandType.CompletionResolveExecute]: ExtensionHostCompletion.executeresolveCompletionItemProvider,
  [ExtensionHostCommandType.ConfigurationSetConfiguration]: ExtensionHostConfiguration.setConfigurations,
  [ExtensionHostCommandType.DefinitionExecuteDefinitionProvider]: ExtensionHostDefinition.executeDefinitionProvider,
  [ExtensionHostCommandType.DiagnosticExecuteDiagnosticProvider]: ExtensionHostDiagnostic.executeDiagnosticProvider,
  [ExtensionHostCommandType.ExtensionActivate]: ExtensionHostExtension.activate,
  [ExtensionHostCommandType.FileSystemGetPathSeparator]: ExtensionHostFileSystem.getPathSeparator,
  [ExtensionHostCommandType.FileSystemReadDirWithFileTypes]: ExtensionHostFileSystem.readDirWithFileTypes,
  [ExtensionHostCommandType.FileSystemReadFile]: ExtensionHostFileSystem.readFile,
  [ExtensionHostCommandType.FileSystemWriteFile]: ExtensionHostFileSystem.writeFile,
  [ExtensionHostCommandType.FormattingExecuteFormmattingProvider]: ExtensionHostFormatting.executeFormattingProvider,
  [ExtensionHostCommandType.HoverExecute]: ExtensionHostHover.executeHoverProvider,
  [ExtensionHostCommandType.ImplementationExecuteImplementationProvider]: ExtensionHostImplementation.executeImplementationProvider,
  [ExtensionHostCommandType.MockExec]: ExtensionHostMockExec.mockExec,
  [ExtensionHostCommandType.MockRpc]: ExtensionHostMockRpc.mockRpc,
  [ExtensionHostCommandType.OrganizeImportsExecute]: ExtensionHostCodeActions.executeOrganizeImports,
  [ExtensionHostCommandType.ReferenceExecuteFileReferenceProvider]: ExtensionHostReference.executefileReferenceProvider,
  [ExtensionHostCommandType.ReferenceExecuteReferenceProvider]: ExtensionHostReference.executeReferenceProvider,
  [ExtensionHostCommandType.SelectionExecuteSelectionProvider]: ExtensionHostSelection.executeSelectionProvider,
  [ExtensionHostCommandType.SourceControlAcceptInput]: ExtensionHostSourceControl.acceptInput,
  [ExtensionHostCommandType.SourceControlAdd]: ExtensionHostSourceControl.add,
  [ExtensionHostCommandType.SourceControlDiscard]: ExtensionHostSourceControl.discard,
  [ExtensionHostCommandType.SourceControlGetChangedFiles]: ExtensionHostSourceControl.getChangedFiles,
  [ExtensionHostCommandType.SourceControlGetEnabledProviderIds]: ExtensionHostSourceControl.getEnabledProviderIds,
  [ExtensionHostCommandType.SourceControlGetFileBefore]: ExtensionHostSourceControl.getFileBefore,
  [ExtensionHostCommandType.SourceControlGetGroups]: ExtensionHostSourceControl.getGroups,
  [ExtensionHostCommandType.StatusBarGetStatusBarItems]: ExtensionHostStatusBar.getStatusBarItems,
  [ExtensionHostCommandType.StatusBarRegisterChangeListener]: ExtensionHostStatusBar.registerChangeListener,
  [ExtensionHostCommandType.TabCompletionExecuteTabCompletionProvider]: ExtensionHostTabCompletion.executeTabCompletionProvider,
  [ExtensionHostCommandType.TextDocumentSetLanguageId]: TextDocument.setLanguageId,
  [ExtensionHostCommandType.TextDocumentSyncFull]: TextDocument.syncFull,
  [ExtensionHostCommandType.TextDocumentSyncIncremental]: TextDocument.syncIncremental,
  [ExtensionHostCommandType.TextSearchExecuteTextSearchProvider]: ExtensionHostTextSearch.executeTextSearchProvider,
  [ExtensionHostCommandType.TypeDefinitionExecuteTypeDefinitionProvider]: ExtensionHostTypeDefinition.executeTypeDefinitionProvider,
  [ExtensionHostCommandType.WorkspaceSetPath]: ExtensionHostWorkspace.setWorkspacePath,
}
