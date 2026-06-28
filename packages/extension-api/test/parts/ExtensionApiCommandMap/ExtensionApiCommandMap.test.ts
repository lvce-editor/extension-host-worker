import { strictEqual } from 'node:assert/strict'
import { test } from 'node:test'
import { commandMap } from '../../../src/parts/ExtensionApiCommandMap/ExtensionApiCommandMap.ts'

test('commandMap exposes hover provider commands', () => {
  strictEqual(typeof commandMap['ExtensionApi.executeHoverProvider'], 'function')
  strictEqual(typeof commandMap['ExtensionApi.getHoverProviderRegistrySnapshot'], 'function')
})

test('commandMap exposes view commands', () => {
  strictEqual(typeof commandMap['ExtensionApi.executeViewProvider'], 'function')
  strictEqual(typeof commandMap['ExtensionApi.getViewRegistrySnapshot'], 'function')
})

test('commandMap exposes output channel commands', () => {
  strictEqual(typeof commandMap['ExtensionApi.getOutputChannelRegistrySnapshot'], 'function')
})

test('commandMap exposes source control provider commands', () => {
  strictEqual(typeof commandMap['ExtensionApi.getSourceControlProviderRegistrySnapshot'], 'function')
  strictEqual(typeof commandMap['ExtensionApi.sourceControlAcceptInput'], 'function')
  strictEqual(typeof commandMap['ExtensionApi.sourceControlAdd'], 'function')
  strictEqual(typeof commandMap['ExtensionApi.sourceControlDiscard'], 'function')
  strictEqual(typeof commandMap['ExtensionApi.sourceControlGenerateCommitMessage'], 'function')
  strictEqual(typeof commandMap['ExtensionApi.sourceControlGetChangedFiles'], 'function')
  strictEqual(typeof commandMap['ExtensionApi.sourceControlGetEnabledProviderIds'], 'function')
  strictEqual(typeof commandMap['ExtensionApi.sourceControlGetFeatures'], 'function')
  strictEqual(typeof commandMap['ExtensionApi.sourceControlGetFileBefore'], 'function')
  strictEqual(typeof commandMap['ExtensionApi.sourceControlGetFileDecorations'], 'function')
  strictEqual(typeof commandMap['ExtensionApi.sourceControlGetGroups'], 'function')
})

test('commandMap keeps completion, diagnostic and formatting provider commands', () => {
  strictEqual(typeof commandMap['ExtensionApi.executeCompletionProvider'], 'function')
  strictEqual(typeof commandMap['ExtensionApi.executeDiagnosticProvider'], 'function')
  strictEqual(typeof commandMap['ExtensionApi.executeFormattingProvider'], 'function')
  strictEqual(typeof commandMap['ExtensionApi.executeResolveCompletionItemProvider'], 'function')
})
