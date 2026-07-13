import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { handleUncaughtExtensionError } from '../../../src/parts/HandleUncaughtExtensionError/HandleUncaughtExtensionError.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

let mockRpc: MockRpcDisposable | undefined

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

test('forwards a serializable error to the extension management worker', async () => {
  const invocations: unknown[][] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.handleUncaughtExtensionError'(error: unknown): Promise<void> {
      invocations.push([error])
    },
  })
  const error = new TypeError('x is not a function')
  error.stack = 'TypeError: x is not a function\n    at activate (extension.js:2:3)'

  await handleUncaughtExtensionError(error)

  deepStrictEqual(invocations, [
    [
      {
        code: undefined,
        codeFrame: undefined,
        constructor: {
          name: 'TypeError',
        },
        message: 'x is not a function',
        name: 'TypeError',
        stack: 'TypeError: x is not a function\n    at activate (extension.js:2:3)',
      },
    ],
  ])
})
