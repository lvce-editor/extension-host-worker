import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { showQuickPick } from '../../../src/parts/QuickPick/QuickPick.ts'
import * as Rpc from '../../../src/parts/Rpc/Rpc.ts'

afterEach(() => {
  Rpc.set(undefined as any)
})

test('showQuickPick invokes extension host quick pick command', async () => {
  let invokedMethod = ''
  let invokedOptions: unknown
  Rpc.set({
    async invoke(method: string, options: unknown): Promise<unknown> {
      invokedMethod = method
      invokedOptions = options
      return 'option-1'
    },
  } as any)
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
  strictEqual(invokedMethod, 'ExtensionHostQuickPick.showQuickPick')
  deepStrictEqual(invokedOptions, options)
})

test('showQuickPick returns undefined when rpc is not configured', async () => {
  const result = await showQuickPick({
    items: [],
  })

  strictEqual(result, undefined)
})
