import { type DisposableMockRpc, ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { deleteSecret, getSecret, storeSecret } from '../../../src/parts/SecretStorage/SecretStorage.ts'

let mockRpc: DisposableMockRpc | undefined

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

test('secret storage invokes extension management worker', async () => {
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.deleteSecret'(): Promise<void> {},
    async 'Extensions.getSecret'(): Promise<string> {
      return 'stored-value'
    },
    async 'Extensions.storeSecret'(): Promise<void> {},
  })

  strictEqual(await getSecret('token'), 'stored-value')
  await storeSecret('token', 'new-value')
  await deleteSecret('token')

  deepStrictEqual(mockRpc.invocations, [
    ['Extensions.getSecret', 'token'],
    ['Extensions.storeSecret', 'token', 'new-value'],
    ['Extensions.deleteSecret', 'token'],
  ])
})
