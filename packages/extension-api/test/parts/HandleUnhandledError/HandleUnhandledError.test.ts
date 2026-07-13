import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { handleUnhandledError } from '../../../src/parts/HandleUnhandledError/HandleUnhandledError.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

let mockRpc: MockRpcDisposable | undefined

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

test('prevents the worker error and forwards it', async () => {
  const invocations: unknown[] = []
  let prevented = false
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.handleUncaughtExtensionError'(error: unknown): Promise<void> {
      invocations.push(error)
    },
  })
  const error = new Error('extension failed')
  const event = {
    error,
    preventDefault(): void {
      prevented = true
    },
  } as ErrorEvent

  await handleUnhandledError(event)

  strictEqual(prevented, true)
  deepStrictEqual(invocations, [
    {
      code: undefined,
      codeFrame: undefined,
      constructor: {
        name: 'Error',
      },
      message: 'extension failed',
      name: 'Error',
      stack: error.stack,
    },
  ])
})

test('creates an error from event details when Chrome provides null', async () => {
  const invocations: unknown[] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.handleUncaughtExtensionError'(error: unknown): Promise<void> {
      invocations.push(error)
    },
  })
  const event = {
    colno: 7,
    error: null,
    filename: 'extension.js',
    lineno: 4,
    message: 'extension failed',
    preventDefault(): void {},
  } as ErrorEvent

  await handleUnhandledError(event)

  deepStrictEqual(invocations, [
    {
      code: undefined,
      codeFrame: undefined,
      constructor: {
        name: 'Error',
      },
      message: 'extension failed',
      name: undefined,
      stack: 'extension failed\n    at extension.js:4:7',
    },
  ])
})
