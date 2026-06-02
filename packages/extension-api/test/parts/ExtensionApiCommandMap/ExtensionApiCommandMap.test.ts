import { strictEqual } from 'node:assert/strict'
import { test } from 'node:test'
import { commandMap } from '../../../src/parts/ExtensionApiCommandMap/ExtensionApiCommandMap.ts'

test('commandMap exposes hover provider commands', () => {
  strictEqual(typeof commandMap['ExtensionApi.executeHoverProvider'], 'function')
  strictEqual(typeof commandMap['ExtensionApi.getHoverProviderRegistrySnapshot'], 'function')
})

test('commandMap keeps completion and formatting provider commands', () => {
  strictEqual(typeof commandMap['ExtensionApi.executeCompletionProvider'], 'function')
  strictEqual(typeof commandMap['ExtensionApi.executeFormattingProvider'], 'function')
  strictEqual(typeof commandMap['ExtensionApi.executeResolveCompletionItemProvider'], 'function')
})
