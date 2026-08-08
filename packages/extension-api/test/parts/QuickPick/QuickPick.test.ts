import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { showFileQuickPick, showQuickInput, showQuickPick } from '../../../src/parts/QuickPick/QuickPick.ts'

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
    acceptInput: true,
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

test('showFileQuickPick opens the file quick pick', async () => {
  const invocations: unknown[][] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(id: string, ...args: readonly unknown[]): Promise<unknown> {
      invocations.push([id, ...args])
      return undefined
    },
  })

  await showFileQuickPick()

  deepStrictEqual(invocations, [['QuickPick.showFile']])
})

test('showQuickInput invokes extension host quick input command', async () => {
  let invokedOptions: unknown
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'ExtensionHostQuickPick.showQuickInput'(options: unknown): Promise<unknown> {
      invokedOptions = options
      return 'user@example.com'
    },
  })
  const options = {
    placeholder: 'Enter SSH host',
    value: 'user@',
  }

  strictEqual(await showQuickInput(options), 'user@example.com')
  deepStrictEqual(invokedOptions, options)
})

test('showQuickInput preserves cancellation', async () => {
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'ExtensionHostQuickPick.showQuickInput'(): Promise<unknown> {
      return undefined
    },
  })

  strictEqual(await showQuickInput(), undefined)
})
