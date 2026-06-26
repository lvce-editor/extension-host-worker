import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { getPreference, setPreference } from '../../../src/parts/Preferences/Preferences.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

let mockRpc: MockRpcDisposable | undefined

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

test('getPreference invokes extension management worker', async () => {
  let invokedKey = ''
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.getPreference'(key: string): Promise<unknown> {
      invokedKey = key
      return 16
    },
  })

  const result = await getPreference('editor.fontSize')

  strictEqual(result, 16)
  strictEqual(invokedKey, 'editor.fontSize')
})

test('setPreference invokes extension management worker', async () => {
  const invocations: unknown[] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.setPreference'(key: string, value: unknown): Promise<void> {
      invocations.push(key, value)
    },
  })

  await setPreference('editor.fontSize', 16)

  deepStrictEqual(invocations, ['editor.fontSize', 16])
})
