import { type DisposableMockRpc, ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { getAccessToken } from '../../../src/parts/Authentication/Authentication.ts'

let mockRpc: DisposableMockRpc | undefined

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

test('getAccessToken invokes extension management worker', async () => {
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.getAccessToken'(): Promise<string> {
      return 'token-1'
    },
  })

  strictEqual(await getAccessToken(), 'token-1')
  strictEqual(
    await getAccessToken({
      refresh: 'if-needed',
    }),
    'token-1',
  )
  deepStrictEqual(mockRpc.invocations, [
    ['Extensions.getAccessToken', {}],
    ['Extensions.getAccessToken', { refresh: 'if-needed' }],
  ])
})
