import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { writeClipboardText } from '../../../src/parts/Clipboard/Clipboard.ts'

let mockRpc: { [Symbol.dispose](): void } | undefined

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

test('writeClipboardText delegates to the permission-checked extension command', async () => {
  let invokedText: unknown
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.writeClipboardText'(text: unknown): Promise<void> {
      invokedText = text
    },
  })

  strictEqual(await writeClipboardText('copied message'), undefined)
  strictEqual(invokedText, 'copied message')
})
