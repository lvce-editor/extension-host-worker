import * as EditorCompletionType from '../EditorCompletionType/EditorCompletionType.ts'
import * as ExtensionHostAjax from '../ExtensionHostAjax/ExtensionHostAjax.ts'
import * as ExtensionHostBraceCompletion from '../ExtensionHostBraceCompletion/ExtensionHostBraceCompletion.ts'
import * as ExtensionHostClosingTag from '../ExtensionHostClosingTag/ExtensionHostClosingTag.ts'
import * as ExtensionHostCodeActions from '../ExtensionHostCodeActions/ExtensionHostCodeActions.ts'
import * as ExtensionHostCommand from '../ExtensionHostCommand/ExtensionHostCommand.ts'
import * as ExtensionHostComment from '../ExtensionHostComment/ExtensionHostComment.ts'
import * as ExtensionHostCompletion from '../ExtensionHostCompletion/ExtensionHostCompletion.ts'
import * as ExtensionHostConfiguration from '../ExtensionHostConfiguration/ExtensionHostConfiguration.ts'
import * as ExtensionHostDebug from '../ExtensionHostDebug/ExtensionHostDebug.ts'
import * as ExtensionHostDefinition from '../ExtensionHostDefinition/ExtensionHostDefinition.ts'
import * as ExtensionHostDiagnostic from '../ExtensionHostDiagnostic/ExtensionHostDiagnostic.ts'
import * as ExtensionHostDialog from '../ExtensionHostDialog/ExtensionHostDialog.ts'
import * as ExtensionHostEnv from '../ExtensionHostEnv/ExtensionHostEnv.ts'
import * as ExtensionHostExec from '../ExtensionHostExec/ExtensionHostExec.ts'
import * as ExtensionHostFileSystem from '../ExtensionHostFileSystem/ExtensionHostFileSystem.ts'
import * as ExtensionHostFormatting from '../ExtensionHostFormatting/ExtensionHostFormatting.ts'
import * as ExtensionHostGetOffset from '../ExtensionHostGetOffset/ExtensionHostGetOffset.ts'
import * as ExtensionHostGetPosition from '../ExtensionHostGetPosition/ExtensionHostGetPosition.ts'
import * as ExtensionHostHover from '../ExtensionHostHover/ExtensionHostHover.ts'
import * as ExtensionHostImplementation from '../ExtensionHostImplementation/ExtensionHostImplementation.ts'
import * as ExtensionHostNodeIpc from '../ExtensionHostNodeRpc/ExtensionHostNodeRpc.ts'
import * as ExtensionHostOutputChannel from '../ExtensionHostOutputChannel/ExtensionHostOutputChannel.ts'
import * as ExtensionHostPrompt from '../ExtensionHostPrompt/ExtensionHostPrompt.ts'
import * as ExtensionHostQuickPick from '../ExtensionHostQuickPick/ExtensionHostQuickPick.ts'
import * as ExtensionHostReference from '../ExtensionHostReference/ExtensionHostReference.ts'
import * as ExtensionHostRename from '../ExtensionHostRename/ExtensionHostRename.ts'
import * as ExtensionHostRpc from '../ExtensionHostRpc/ExtensionHostRpc.ts'
import * as ExtensionHostSelection from '../ExtensionHostSelection/ExtensionHostSelection.ts'
import * as ExtensionHostSourceControl from '../ExtensionHostSourceControl/ExtensionHostSourceControl.ts'
import * as ExtensionHostTabCompletion from '../ExtensionHostTabCompletion/ExtensionHostTabCompletion.ts'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.ts'
import * as ExtensionHostTextSearch from '../ExtensionHostTextSearch/ExtensionHostTextSearch.ts'
import * as ExtensionHostTypeDefinition from '../ExtensionHostTypeDefinition/ExtensionHostTypeDefinition.ts'
import * as ExtensionHostUrl from '../ExtensionHostUrl/ExtensionHostUrl.ts'
import * as ExtensionHostWebView from '../ExtensionHostWebView/ExtensionHostWebView.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'
import * as ExtensionHostWorkspace from '../ExtensionHostWorkspace/ExtensionHostWorkspace.ts'
import { FormattingError } from '../FormattingError/FormattingError.ts'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.ts'
import { VError } from '../VError/VError.ts'

export const api = {
  // Prompt
  confirm: ExtensionHostPrompt.confirm,

  createNodeRpc: ExtensionHostNodeIpc.createNodeRpc,
  // Rpc
  createRpc: ExtensionHostRpc.createRpc,

  // Worker
  createWorker: ExtensionHostWorker.createWorker,
  EditorCompletionType,

  // Env
  env: ExtensionHostEnv.env,

  // Exec`
  exec: ExtensionHostExec.exec,
  executeBraceCompletionProvider: ExtensionHostBraceCompletion.executeBraceCompletionProvider,

  // Comment

  executeClosingTagProvider: ExtensionHostClosingTag.executeClosingTagProvider,
  executeCommand: ExtensionHostCommand.executeCommand,

  executeCommentProvider: ExtensionHostComment.executeCommentProvider,
  executeCompletionProvider: ExtensionHostCompletion.executeCompletionProvider,
  executeDefinitionProvider: ExtensionHostDefinition.executeDefinitionProvider,

  executeDiagnosticProvider: ExtensionHostDiagnostic.executeDiagnosticProvider,

  executeFormattingProvider: ExtensionHostFormatting.executeFormattingProvider,

  executeHoverProvider: ExtensionHostHover.executeHoverProvider,
  executeImplementationProvider: ExtensionHostImplementation.executeImplementationProvider,

  executePrepareRenameProvider: ExtensionHostRename.executeprepareRenameProvider,
  executeReferenceProvider: ExtensionHostReference.executeReferenceProvider,

  executeRenameProvider: ExtensionHostRename.executeRenameProvider,

  executeSelectionProvider: ExtensionHostSelection.executeSelectionProvider,

  executeTabCompletionProvider: ExtensionHostTabCompletion.executeTabCompletionProvider,
  executeTextSearchProvider: ExtensionHostTextSearch.executeTextSearchProvider,

  executeTypeDefinitionProvider: ExtensionHostTypeDefinition.executeTypeDefinitionProvider,

  exists: ExtensionHostFileSystem.existsExternal,
  // Errors
  FormattingError,
  // Configuration
  getConfiguration: ExtensionHostConfiguration.getConfiguration,
  // Ajax
  getJson: ExtensionHostAjax.getJson,
  // Get Offset
  getOffset: ExtensionHostGetOffset.getOffset,
  // Get Position
  getPosition: ExtensionHostGetPosition.getPosition,
  // Url
  getRemoteUrl: ExtensionHostUrl.getRemoteUrl,
  // Text Document
  getTextFromTextDocument: TextDocument.getText,

  getWorkspaceFolder: ExtensionHostWorkspace.getWorkspaceFolder,
  // Workspace
  handleWorkspaceRefresh: ExtensionHostWorkspace.handleWorkspaceRefresh,

  mkdir: ExtensionHostFileSystem.mkdirExternal,

  readDirWithFileTypes: ExtensionHostFileSystem.readDirWithFileTypesExternal,

  readFile: ExtensionHostFileSystem.readFileExternal,
  // Brace Completion
  registerBraceCompletionProvider: ExtensionHostBraceCompletion.registerBraceCompletionProvider,

  // Closing Tag
  registerClosingTagProvider: ExtensionHostClosingTag.registerClosingTagProvider,
  // Code Action
  registerCodeActionsProvider: ExtensionHostCodeActions.registerCodeActionProvider,

  // Command
  registerCommand: ExtensionHostCommand.registerCommand,
  registerCommentProvider: ExtensionHostComment.registerCommentProvider,

  // Completion
  registerCompletionProvider: ExtensionHostCompletion.registerCompletionProvider,

  // Debug
  registerDebugProvider: ExtensionHostDebug.registerDebugProvider,

  // Definition
  registerDefinitionProvider: ExtensionHostDefinition.registerDefinitionProvider,

  // Diagnostic
  registerDiagnosticProvider: ExtensionHostDiagnostic.registerDiagnosticProvider,
  // File System
  registerFileSystemProvider: ExtensionHostFileSystem.registerFileSystemProvider,
  // Formatting
  registerFormattingProvider: ExtensionHostFormatting.registerFormattingProvider,

  // Hover
  registerHoverProvider: ExtensionHostHover.registerHoverProvider,
  // Implementation
  registerImplementationProvider: ExtensionHostImplementation.registerImplementationProvider,

  // Output
  registerOutputChannel: ExtensionHostOutputChannel.registerOutputChannel,
  // Reference
  registerReferenceProvider: ExtensionHostReference.registerReferenceProvider,

  // Rename
  registerRenameProvider: ExtensionHostRename.registerRenameProvider,

  // Selection
  registerSelectionProvider: ExtensionHostSelection.registerSelectionProvider,
  // Source Control
  registerSourceControlProvider: ExtensionHostSourceControl.registerSourceControlProvider,

  // Tab Completion
  registerTabCompletionProvider: ExtensionHostTabCompletion.registerTabCompletionProvider,

  // Text Search
  registerTextSearchProvider: ExtensionHostTextSearch.registerTextSearchProvider,
  // Type Definition
  registerTypeDefinitionProvider: ExtensionHostTypeDefinition.registerTypeDefinitionProvider,
  // Webview
  registerWebViewProvider: ExtensionHostWebView.registerWebViewProvider,

  remove: ExtensionHostFileSystem.removeExternal,
  // Dialog
  showInformationMessage: ExtensionHostDialog.showInformationMessage,

  // QuickPick
  showQuickPick: ExtensionHostQuickPick.showQuickPick,

  stat: ExtensionHostFileSystem.statExternal,

  TextSearchResultType,

  VError,
  writeFile: ExtensionHostFileSystem.writeFileExternal,
}
