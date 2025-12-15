import * as ActivateExtension2 from '../ActivateExtension2/ActivateExtension2.ts'
import { activateExtension3 } from '../ActivateExtension3/ActivateExtension3.ts'
import * as ExtensionHostExtension from '../ActivateExtension/ActivateExtension.ts'
import * as AddWebExtension from '../AddWebExtension/AddWebExtension.ts'
import * as BulkReplacement from '../BulkReplacement/BulkReplacement.ts'
import * as ColorTheme from '../ColorTheme/ColorTheme.ts'
import * as CreateWebView3 from '../CreateWebView3/CreateWebView3.ts'
import * as CreateWebViewRpc2 from '../CreateWebViewRpc2/CreateWebViewRpc2.ts'
import * as CreateWebViewRpc from '../CreateWebViewRpc/CreateWebViewRpc.ts'
import * as ExecuteExternalCommand from '../ExecuteExternalCommand/ExecuteExternalCommand.ts'
import * as ExtensionHostBraceCompletion from '../ExtensionHostBraceCompletion/ExtensionHostBraceCompletion.ts'
import * as ExtensionHostClosingTag from '../ExtensionHostClosingTag/ExtensionHostClosingTag.ts'
import * as ExtensionHostCodeActions from '../ExtensionHostCodeActions/ExtensionHostCodeActions.ts'
import * as ExtensionHostCommand from '../ExtensionHostCommand/ExtensionHostCommand.ts'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import { executeCommentProvider } from '../ExtensionHostComment/ExtensionHostComment.ts'
import * as ExtensionHostCompletion from '../ExtensionHostCompletion/ExtensionHostCompletion.ts'
import * as ExtensionHostConfiguration from '../ExtensionHostConfiguration/ExtensionHostConfiguration.ts'
import * as ExtensionHostDebug from '../ExtensionHostDebug/ExtensionHostDebug.ts'
import * as ExtensionHostDefinition from '../ExtensionHostDefinition/ExtensionHostDefinition.ts'
import * as ExtensionHostDiagnostic from '../ExtensionHostDiagnostic/ExtensionHostDiagnostic.ts'
import * as ExtensionHostFileSystem from '../ExtensionHostFileSystem/ExtensionHostFileSystem.ts'
import * as ExtensionHostFormatting from '../ExtensionHostFormatting/ExtensionHostFormatting.ts'
import * as ExtensionHostHover from '../ExtensionHostHover/ExtensionHostHover.ts'
import * as ExtensionHostImplementation from '../ExtensionHostImplementation/ExtensionHostImplementation.ts'
import * as ExtensionHostMockExec from '../ExtensionHostMockExec/ExtensionHostMockExec.ts'
import * as ExtensionHostMockRpc from '../ExtensionHostMockRpc/ExtensionHostMockRpc.ts'
import * as ExtensionHostOutputChannel from '../ExtensionHostOutputChannel/ExtensionHostOutputChannel.ts'
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
import * as GetColorThemeCss from '../GetColorThemeCss/GetColorThemeCss.ts'
import * as GetColorThemeJson from '../GetColorThemeJson/GetColorThemeJson.ts'
import * as GetColorThemeNames from '../GetColorThemeNames/GetColorThemeNames.ts'
import * as GetExtension from '../GetExtension/GetExtension.ts'
import * as GetExtensions from '../GetExtensions/GetExtensions.ts'
import * as GetIconThemeJson from '../GetIconThemeJson/GetIconThemeJson.ts'
import * as GetRpcInfo from '../GetRpcInfo/GetRpcInfo.ts'
import * as GetRuntimeStatus from '../GetRuntimeStatus/GetRuntimeStatus.ts'
import * as GetWebViewInfo2 from '../GetWebViewInfo2/GetWebViewInfo2.ts'
import * as GetWebViews from '../GetWebViews/GetWebViews.ts'
import * as HandleBeforeUnload from '../HandleBeforeUnload/HandleBeforeUnload.ts'
import * as HandleMessagePort2 from '../HandleMessagePort2/HandleMessagePort2.ts'
import * as HandleMessagePort from '../HandleMessagePort/HandleMessagePort.ts'
import * as IconTheme from '../IconTheme/IconTheme.ts'
import * as IconThemeState from '../IconThemeState/IconThemeState.ts'
import * as ImportExtension from '../ImportExtension/ImportExtension.ts'
import * as IndexedDb from '../IndexedDb/IndexedDb.ts'
import * as IndexedDbKeyValueStorage from '../IndexedDbKeyValueStorage/IndexedDbKeyValueStorage.ts'
import * as InvalidateExtensionsCache from '../InvalidateExtensionsCache/InvalidateExtensionsCache.ts'
import * as Languages from '../Languages/Languages.ts'
import * as LaunchIframeWorker from '../LaunchIframeWorker/LaunchIframeWorker.ts'
import * as LoadWebView from '../LoadWebView/LoadWebView.ts'
import * as SaveState from '../SaveState/SaveState.ts'
import * as SearchFileWithFetch from '../SearchFileWithFetch/SearchFileWithFetch.ts'
import * as SearchFileWithHtml from '../SearchFileWithHtml/SearchFileWithHtml.ts'
import * as SearchFileWithMemory from '../SearchFileWithMemory/SearchFileWithMemory.ts'
import * as TextSearchFetch from '../TextSearchFetch/TextSearchFetch.ts'
import * as TextSearchHtml from '../TextSearchHtml/TextSearchHtml.ts'
import * as TextSearchMemory from '../TextSearchMemory/TextSearchMemory.ts'
import * as WebViewInterceptor from '../WebViewInterceptor/WebViewInterceptor.ts'

export const commandMap = {
  'BulkReplacement.applyBulkReplacement': BulkReplacement.applyBulkReplacement,
  'ColorTheme.getColorThemeCssFromJson': GetColorThemeCss.getColorThemeCssFromJson,
  'ColorTheme.getColorThemeJson': GetColorThemeJson.getColorThemeJson,
  'ColorTheme.getColorThemeNames': GetColorThemeNames.getColorThemeNames,
  'ColorTheme.hydrate': ColorTheme.hydrate,
  'ExecuteExternalCommand.executeExternalCommand': ExecuteExternalCommand.executeExternalCommand,
  'ExtensionHost.activateExtension2': ActivateExtension2.activateExtension2,
  'ExtensionHost.activateExtension3': activateExtension3,
  'ExtensionHost.getRuntimeStatus': GetRuntimeStatus.getRuntimeStatus,
  'ExtensionHost.importExtension': ImportExtension.importExtension,
  'ExtensionHost.launchIframeWorker': LaunchIframeWorker.launchIframeWorker,
  [ExtensionHostCommandType.BraceCompletionExecuteBraceCompletionProvider]: ExtensionHostBraceCompletion.executeBraceCompletionProvider,
  [ExtensionHostCommandType.ClosingTagExecuteClosingTagProvider]: ExtensionHostClosingTag.executeClosingTagProvider,
  [ExtensionHostCommandType.CommandExecute]: ExtensionHostCommand.executeCommand,
  [ExtensionHostCommandType.CommentProviderExecute]: executeCommentProvider,
  [ExtensionHostCommandType.CompletionExecute]: ExtensionHostCompletion.executeCompletionProvider,
  [ExtensionHostCommandType.CompletionResolveExecute]: ExtensionHostCompletion.executeresolveCompletionItemProvider,
  [ExtensionHostCommandType.ConfigurationSetConfiguration]: ExtensionHostConfiguration.setConfigurations,
  [ExtensionHostCommandType.DefinitionExecuteDefinitionProvider]: ExtensionHostDefinition.executeDefinitionProvider,
  [ExtensionHostCommandType.DiagnosticExecuteDiagnosticProvider]: ExtensionHostDiagnostic.executeDiagnosticProvider,
  [ExtensionHostCommandType.ExtensionActivate]: ExtensionHostExtension.activateExtension,
  [ExtensionHostCommandType.FileSystemGetPathSeparator]: ExtensionHostFileSystem.getPathSeparator,
  [ExtensionHostCommandType.FileSystemMkdir]: ExtensionHostFileSystem.mkdir,
  [ExtensionHostCommandType.FileSystemReadDirWithFileTypes]: ExtensionHostFileSystem.readDirWithFileTypes,
  [ExtensionHostCommandType.FileSystemReadFile]: ExtensionHostFileSystem.readFile,
  [ExtensionHostCommandType.FileSystemRemove]: ExtensionHostFileSystem.remove,
  [ExtensionHostCommandType.FileSystemRename]: ExtensionHostFileSystem.rename,
  [ExtensionHostCommandType.FileSystemWriteFile]: ExtensionHostFileSystem.writeFile,
  [ExtensionHostCommandType.FormattingExecuteFormmattingProvider]: ExtensionHostFormatting.executeFormattingProvider,
  [ExtensionHostCommandType.HoverExecute]: ExtensionHostHover.executeHoverProvider,
  [ExtensionHostCommandType.ImplementationExecuteImplementationProvider]: ExtensionHostImplementation.executeImplementationProvider,
  [ExtensionHostCommandType.MockExec]: ExtensionHostMockExec.mockExec,
  [ExtensionHostCommandType.MockRpc]: ExtensionHostMockRpc.mockRpc,
  [ExtensionHostCommandType.OrganizeImportsExecute]: ExtensionHostCodeActions.executeOrganizeImports,
  [ExtensionHostCommandType.ReferenceExecuteFileReferenceProvider]: ExtensionHostReference.executefileReferenceProvider,
  [ExtensionHostCommandType.ReferenceExecuteReferenceProvider]: ExtensionHostReference.executeReferenceProvider,
  [ExtensionHostCommandType.ReferenceExecuteReferenceProvider2]: ExtensionHostReference.executeReferenceProvider2,
  [ExtensionHostCommandType.SelectionExecuteSelectionProvider]: ExtensionHostSelection.executeSelectionProvider,
  [ExtensionHostCommandType.SourceControlAcceptInput]: ExtensionHostSourceControl.acceptInput,
  [ExtensionHostCommandType.SourceControlAdd]: ExtensionHostSourceControl.add,
  [ExtensionHostCommandType.SourceControlDiscard]: ExtensionHostSourceControl.discard,
  [ExtensionHostCommandType.SourceControlGetChangedFiles]: ExtensionHostSourceControl.getChangedFiles,
  [ExtensionHostCommandType.SourceControlGetEnabledProviderIds]: ExtensionHostSourceControl.getEnabledProviderIds,
  [ExtensionHostCommandType.SourceControlGetFileBefore]: ExtensionHostSourceControl.getFileBefore,
  [ExtensionHostCommandType.SourceControlGetFileBefore2]: ExtensionHostSourceControl.getFileBefore,
  [ExtensionHostCommandType.SourceControlGetFileDecorations]: ExtensionHostSourceControl.getFileDecorations,
  [ExtensionHostCommandType.SourceControlGetGroups]: ExtensionHostSourceControl.getGroups,
  [ExtensionHostCommandType.StatusBarExecuteCommand]: ExtensionHostStatusBar.executeCommand,
  [ExtensionHostCommandType.StatusBarGetStatusBarItems]: ExtensionHostStatusBar.getStatusBarItems,
  [ExtensionHostCommandType.StatusBarGetStatusBarItems2]: ExtensionHostStatusBar.getStatusBarItems2,
  [ExtensionHostCommandType.StatusBarRegisterChangeListener]: ExtensionHostStatusBar.registerChangeListener,
  [ExtensionHostCommandType.TabCompletionExecuteTabCompletionProvider]: ExtensionHostTabCompletion.executeTabCompletionProvider,
  [ExtensionHostCommandType.TextDocumentSetLanguageId]: TextDocument.setLanguageId,
  [ExtensionHostCommandType.TextDocumentSyncFull]: TextDocument.syncFull,
  [ExtensionHostCommandType.TextDocumentSyncIncremental]: TextDocument.syncIncremental,
  [ExtensionHostCommandType.TextSearchExecuteTextSearchProvider]: ExtensionHostTextSearch.executeTextSearchProvider,
  [ExtensionHostCommandType.TypeDefinitionExecuteTypeDefinitionProvider]: ExtensionHostTypeDefinition.executeTypeDefinitionProvider,
  [ExtensionHostCommandType.WorkspaceSetPath]: ExtensionHostWorkspace.setWorkspacePath,
  'ExtensionHostDebug.evaluate': ExtensionHostDebug.evaluate,
  'ExtensionHostDebug.getCallStack': ExtensionHostDebug.getCallStack,
  'ExtensionHostDebug.getPausedStatus': ExtensionHostDebug.getPausedStatus,
  'ExtensionHostDebug.getProperties': ExtensionHostDebug.getProperties,
  'ExtensionHostDebug.getScopeChain': ExtensionHostDebug.getScopeChain,
  'ExtensionHostDebug.getScripts': ExtensionHostDebug.getScripts,
  'ExtensionHostDebug.getScriptSource': ExtensionHostDebug.getScriptSource,
  'ExtensionHostDebug.getStatus': ExtensionHostDebug.getStatus,
  'ExtensionHostDebug.listProcesses': ExtensionHostDebug.listProcesses,
  'ExtensionHostDebug.pause': ExtensionHostDebug.pause,
  'ExtensionHostDebug.resume': ExtensionHostDebug.resume,
  'ExtensionHostDebug.setPauseOnException': ExtensionHostDebug.setPauseOnException,
  'ExtensionHostDebug.setPauseOnExceptions': ExtensionHostDebug.setPauseOnExceptions,
  'ExtensionHostDebug.start': ExtensionHostDebug.start,
  'ExtensionHostDebug.stepInto': ExtensionHostDebug.stepInto,
  'ExtensionHostDebug.stepOut': ExtensionHostDebug.stepOut,
  'ExtensionHostDebug.stepOver': ExtensionHostDebug.stepOver,
  'ExtensionHostRename.executeprepareRenameProvider': ExtensionHostRename.executeprepareRenameProvider,
  'ExtensionHostRename.executeRenameProvider': ExtensionHostRename.executeRenameProvider,
  'ExtensionHostSourceControl.getIconDefinitions': ExtensionHostSourceControl.getIconDefinitions,
  'ExtensionHostWebView.create': ExtensionHostWebView.createWebView,
  'ExtensionHostWebView.dispose': ExtensionHostWebView.disposeWebView,
  'ExtensionHostWebView.getWebViewInfo': ExtensionHostWebView.getWebViewInfo,
  'ExtensionHostWebView.getWebViewInfo2': GetWebViewInfo2.getWebViewInfo2,
  'ExtensionHostWebView.load': LoadWebView.loadWebView,
  'Extensions.addWebExtension': AddWebExtension.addWebExtension,
  'Extensions.getExtension': GetExtension.getExtension,
  'Extensions.getExtensions': GetExtensions.getExtensions,
  'Extensions.invalidateExtensionsCache': InvalidateExtensionsCache.invalidateExtensionsCache,
  'FileSystemFetch.chmod': FileSystemFetch.chmod,
  'FileSystemFetch.exists': FileSystemFetch.exists,
  'FileSystemFetch.getBlob': FileSystemFetch.getBlob,
  'FileSystemFetch.mkdir': FileSystemFetch.mkdir,
  'FileSystemFetch.readDirWithFileTypes': FileSystemFetch.readDirWithFileTypes,
  'FileSystemFetch.readFile': FileSystemFetch.readFile,
  'FileSystemFetch.remove': FileSystemFetch.remove,
  'FileSystemFetch.writeFile': FileSystemFetch.writeFile,
  'FileSystemMemory.chmod': FileSystemMemory.chmod,
  'FileSystemMemory.copy': FileSystemMemory.copy,
  'FileSystemMemory.exists': FileSystemMemory.exists,
  'FileSystemMemory.getBlob': FileSystemMemory.getBlob,
  'FileSystemMemory.getBlobUrl': FileSystemMemory.getBlobUrl,
  'FileSystemMemory.getFiles': FileSystemMemory.getFiles,
  'FileSystemMemory.mkdir': FileSystemMemory.mkdir,
  'FileSystemMemory.readDirWithFileTypes': FileSystemMemory.readDirWithFileTypes,
  'FileSystemMemory.readFile': FileSystemMemory.readFile,
  'FileSystemMemory.remove': FileSystemMemory.remove,
  'FileSystemMemory.rename': FileSystemMemory.rename,
  'FileSystemMemory.stat': FileSystemMemory.stat,
  'FileSystemMemory.writeFile': FileSystemMemory.writeFile,
  'HandleBeforeUnload.handleBeforeUnload': HandleBeforeUnload.handleBeforeUnload,
  'HandleMessagePort.handleMessagePort': HandleMessagePort.handleMessagePort,
  'HandleMessagePort.handleMessagePort2': HandleMessagePort2.handleMessagePort2,
  'IconTheme.getJson': GetIconThemeJson.getIconThemeJson,
  'IconTheme.getState': IconThemeState.getState,
  'IconTheme.hydrate': IconTheme.hydrate,
  'IconTheme.setIconTheme': IconTheme.setIconTheme,
  'IndexedDb.addHandle': IndexedDb.addHandle,
  'IndexedDb.get': IndexedDbKeyValueStorage.get,
  'IndexedDb.getHandle': IndexedDb.getHandle,
  'IndexedDb.getValues': IndexedDb.getValues,
  'IndexedDb.getValuesByIndexName': IndexedDb.getValuesByIndexName,
  'IndexedDb.saveValue': IndexedDb.saveValue,
  'IndexedDb.set': IndexedDbKeyValueStorage.set,
  'Languages.getLanguages': Languages.getLanguages,
  'Output.getEnabledProviders': ExtensionHostOutputChannel.getEnabledProviders,
  'SaveState.saveState': SaveState.saveState,
  'SearchFileWithFetch.searchFileWithFetch': SearchFileWithFetch.searchFile,
  'SearchFileWithHtml.searchFileWithHtml': SearchFileWithHtml.searchFile,
  'SearchFileWithMemory.searchFileWithMemory': SearchFileWithMemory.searchFile,
  'TextSearchFetch.textSearch': TextSearchFetch.textSearch,
  'TextSearchHtml.textSearch': TextSearchHtml.textSearch,
  'TextSearchMemory.textSearch': TextSearchMemory.textSearch,
  'TextSearchMemory.textSearch2': TextSearchMemory.textSearch2,
  'WebView.create3': CreateWebView3.createWebView3,
  'WebView.createWebViewWorkerRpc': CreateWebViewRpc.createWebViewWorkerRpc,
  'WebView.createWebViewWorkerRpc2': CreateWebViewRpc2.createWebViewWorkerRpc2,
  'WebView.getRpcInfo': GetRpcInfo.getRpcInfo,
  'WebView.registerInterceptor': WebViewInterceptor.registerInterceptor,
  'WebView.unregisterInterceptor': WebViewInterceptor.unregisterInterceptor,
  'WebViews.getWebViews': GetWebViews.getWebViews,
}
