import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { showQuickPick } from '../../../src/parts/QuickPick/QuickPick.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

let mockRpc: MockRpcDisposable | undefined

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

test('showQuickPick invokes extension host quick pick command', async () => {
  let invokedOptions: unknown
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'ExtensionHostQuickPick.showQuickPick'(options: unknown): Promise<unknown> {
      invokedOptions = options
      return 'option-1'
    },
  })
  const options = {
    items: [
      {
        description: 'First option',
        label: 'Option 1',
        value: 'option-1',
      },
    ],
    placeholder: 'Select option',
  }

  const result = await showQuickPick(options)

  strictEqual(result, 'option-1')
  deepStrictEqual(invokedOptions, options)
})
