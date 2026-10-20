import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual } from 'node:assert/strict'
import { test } from 'node:test'
import { registerEditorKeymap } from '../../../src/parts/EditorKeymap/EditorKeymap.ts'

test('registers through the application command route and disposes once', async () => {
  const calls: unknown[][] = []
  const rpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(...args: readonly unknown[]): Promise<unknown> {
      calls.push([...args])
      return 42
    },
  })
  try {
    const keymap = { initialMode: 'normal', modes: { normal: { bindings: {}, captureText: true } } }
    const handle = await registerEditorKeymap(keymap)
    deepStrictEqual(calls, [['EditorKeymap.register', keymap]])
    await handle.dispose()
    await handle.dispose()
    deepStrictEqual(calls, [
      ['EditorKeymap.register', keymap],
      ['EditorKeymap.remove', 42],
    ])
  } finally {
    rpc[Symbol.dispose]()
  }
})
