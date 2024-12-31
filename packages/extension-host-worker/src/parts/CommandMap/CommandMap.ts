import * as CreateWebView3 from '../CreateWebView3/CreateWebView3.ts'
import * as CreateWebViewRpc from '../CreateWebViewRpc/CreateWebViewRpc.ts'
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
import * as ExtensionHostRename from '../ExtensionHostRename/ExtensionHostRename.ts'
import * as ExtensionHostSelection from '../ExtensionHostSelection/ExtensionHostSelection.ts'
import * as ExtensionHostSourceControl from '../ExtensionHostSourceControl/ExtensionHostSourceControl.ts'
import * as ExtensionHostStatusBar from '../ExtensionHostStatusBar/ExtensionHostStatusBar.ts'
import * as ExtensionHostTabCompletion from '../ExtensionHostTabCompletion/ExtensionHostTabCompletion.ts'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.ts'
import * as ExtensionHostTextSearch from '../ExtensionHostTextSearch/ExtensionHostTextSearch.ts'
import * as ExtensionHostTypeDefinition from '../ExtensionHostTypeDefinition/ExtensionHostTypeDefinition.ts'
import * as ExtensionHostWebView from '../ExtensionHostWebView/ExtensionHostWebView.ts'
import * as ExtensionHostWorkspace from '../ExtensionHostWorkspace/ExtensionHostWorkspace.ts'
import * as FileSystemFetch from '../FileSystemFetch/FileSystemFetch.ts'
import * as FileSystemMemory from '../FileSystemMemory/FileSystemMemory.ts'
import * as GetRpcInfo from '../GetRpcInfo/GetRpcInfo.ts'
import * as HandleBeforeUnload from '../HandleBeforeUnload/HandleBeforeUnload.ts'
import * as HandleMessagePort from '../HandleMessagePort/HandleMessagePort.ts'
import * as IndexedDb from '../IndexedDb/IndexedDb.ts'
import * as IndexedDbKeyValueStorage from '../IndexedDbKeyValueStorage/IndexedDbKeyValueStorage.ts'
import * as LaunchIframeWorker from '../LaunchIframeWorker/LaunchIframeWorker.ts'
import * as LoadWebView from '../LoadWebView/LoadWebView.ts'
import * as SaveState from '../SaveState/SaveState.ts'
import * as SearchFileWithFetch from '../SearchFileWithFetch/SearchFileWithFetch.ts'
import * as SearchFileWithHtml from '../SearchFileWithHtml/SearchFileWithHtml.ts'
import * as TextSearchFetch from '../TextSearchFetch/TextSearchFetch.ts'
import * as TextSearchHtml from '../TextSearchHtml/TextSearchHtml.ts'
import * as TextSearchMemory from '../TextSearchMemory/TextSearchMemory.ts'

export const commandMap = {
  'ExtensionHost.launchIframeWorker': LaunchIframeWorker.launchIframeWorker,
  'ExtensionHostRename.executeprepareRenameProvider': ExtensionHostRename.executeprepareRenameProvider,
  'ExtensionHostRename.executeRenameProvider': ExtensionHostRename.executeRenameProvider,
  'FileSystemFetch.chmod': FileSystemFetch.chmod,
  'FileSystemFetch.getBlob': FileSystemFetch.getBlob,
  'FileSystemFetch.mkdir': FileSystemFetch.mkdir,
  'FileSystemFetch.readDirWithFileTypes': FileSystemFetch.readDirWithFileTypes,
  'FileSystemFetch.readFile': FileSystemFetch.readFile,
  'FileSystemFetch.remove': FileSystemFetch.remove,
  'FileSystemFetch.writeFile': FileSystemFetch.writeFile,
  'FileSystemMemory.chmod': FileSystemMemory.chmod,
  'FileSystemMemory.getBlob': FileSystemMemory.getBlob,
  'FileSystemMemory.getBlobUrl': FileSystemMemory.getBlobUrl,
  'FileSystemMemory.getFiles': FileSystemMemory.getFiles,
  'FileSystemMemory.mkdir': FileSystemMemory.mkdir,
  'FileSystemMemory.readDirWithFileTypes': FileSystemMemory.readDirWithFileTypes,
  'FileSystemMemory.readFile': FileSystemMemory.readFile,
  'FileSystemMemory.remove': FileSystemMemory.remove,
  'FileSystemMemory.writeFile': FileSystemMemory.writeFile,
  'IndexedDb.addHandle': IndexedDb.addHandle,
  'IndexedDb.get': IndexedDbKeyValueStorage.get,
  'IndexedDb.getHandle': IndexedDb.getHandle,
  'IndexedDb.getValues': IndexedDb.getValues,
  'IndexedDb.getValuesByIndexName': IndexedDb.getValuesByIndexName,
  'IndexedDb.saveValue': IndexedDb.saveValue,
  'IndexedDb.set': IndexedDbKeyValueStorage.set,
  'SearchFileWithFetch.searchFileWithFetch': SearchFileWithFetch.searchFile,
  'SearchFileWithHtml.searchFileWithHtml': SearchFileWithHtml.searchFile,
  'TextSearchFetch.textSearch': TextSearchFetch.textSearch,
  'TextSearchHtml.textSearch': TextSearchHtml.textSearch,
  'TextSearchMemory.textSearch': TextSearchMemory.textSearch,
  'WebView.create3': CreateWebView3.createWebView3,
  'WebView.createWebViewWorkerRpc': CreateWebViewRpc.createWebViewWorkerRpc,
  'WebView.getRpcInfo': GetRpcInfo.getRpcInfo,
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
  ['ExtensionHostWebView.getWebViewInfo']: ExtensionHostWebView.getWebViewInfo,
  ['ExtensionHostWebView.load']: LoadWebView.loadWebView,
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
