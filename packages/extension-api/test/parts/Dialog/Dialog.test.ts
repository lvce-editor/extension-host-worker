import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { showDialog } from '../../../src/parts/Dialog/Dialog.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

let mockRpc: MockRpcDisposable | undefined

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

test('showDialog forwards options to the application-scoped dialog command', async () => {
  let invokedOptions: unknown
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'ExtensionHostDialog.showDialog'(options: unknown): Promise<void> {
      invokedOptions = options
    },
  })
  const options = {
    closeMessage: 'Cancel',
    confirmMessage: 'OK',
    message: 'No files have been changed.',
    title: 'Example Error',
    type: 'error' as const,
  }

  strictEqual(await showDialog(options), undefined)
  deepStrictEqual(invokedOptions, options)
})
