import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, rejects, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { openColorPicker, showFileQuickPick, showQuickInput, showQuickPick } from '../../../src/parts/QuickPick/QuickPick.ts'

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

test('showQuickPick forwards the freeform text type', async () => {
  let invokedOptions: unknown
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'ExtensionHostQuickPick.showQuickPick'(options: unknown): Promise<unknown> {
      invokedOptions = options
      return 'Ada'
    },
  })
  strictEqual(await showQuickPick({ items: [], type: 'text' }), 'Ada')
  deepStrictEqual(invokedOptions, { items: [], type: 'text' })
})

test('openColorPicker requires an editor id and keeps the initial color separate', async () => {
  const invocations: unknown[][] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(id: string, ...args: readonly unknown[]): Promise<unknown> {
      invocations.push([id, ...args])
      return undefined
    },
  })
  for (const invalid of [undefined, null, '#ff8800', -1, NaN, Infinity, 1.5]) {
    await rejects(openColorPicker(invalid as number), /editorId/)
  }
  await rejects(openColorPicker(42, 123 as unknown as string), /initialColor/)
  deepStrictEqual(invocations, [])
  await openColorPicker(42, '#ff8800')
  await openColorPicker(43)
  deepStrictEqual(invocations, [
    ['GetActiveEditor.openColorPicker', 42, '#ff8800'],
    ['GetActiveEditor.openColorPicker', 43, undefined],
  ])
})
