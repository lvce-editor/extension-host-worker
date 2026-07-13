import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { handleUnhandledRejection } from '../../../src/parts/HandleUnhandledRejection/HandleUnhandledRejection.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

let mockRpc: MockRpcDisposable | undefined

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

test('prevents the unhandled rejection and forwards its reason', async () => {
  const invocations: unknown[] = []
  let prevented = false
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.handleUncaughtExtensionError'(error: unknown): Promise<void> {
      invocations.push(error)
    },
  })
  const event = {
    preventDefault(): void {
      prevented = true
    },
    reason: 'extension rejected',
  } as PromiseRejectionEvent

  await handleUnhandledRejection(event)

  strictEqual(prevented, true)
  deepStrictEqual(invocations, ['extension rejected'])
})
