import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual } from 'node:assert/strict'
import { test } from 'node:test'
import { refreshEditorGutterDecorations } from '../../../src/parts/RefreshEditorGutterDecorations/RefreshEditorGutterDecorations.ts'

test('refreshEditorGutterDecorations refreshes all open editors', async () => {
  const invocations: unknown[] = []
  using _rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeCommand': (...args: readonly unknown[]) => {
      invocations.push(args)
    },
  })

  await refreshEditorGutterDecorations()

  deepStrictEqual(invocations, [['Editor.refreshGutterDecorationsAll']])
})
