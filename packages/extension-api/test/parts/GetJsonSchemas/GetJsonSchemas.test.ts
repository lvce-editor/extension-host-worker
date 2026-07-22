import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { getJsonSchemas } from '../../../src/parts/GetJsonSchemas/GetJsonSchemas.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

let mockRpc: MockRpcDisposable | undefined

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

test('gets JSON schema contributions from the extension host', async () => {
  const schemas = [{ fileMatch: 'package.json', url: '/extensions/prettier/schemas/package.schema.json' }]
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.getJsonSchemas'() {
      return schemas
    },
  })

  deepStrictEqual(await getJsonSchemas(), schemas)
})

test('preserves array file matches and remote URLs', async () => {
  const schemas = [
    {
      fileMatch: ['.prettierrc', 'package.json'],
      url: 'https://json.schemastore.org/prettierrc',
    },
  ]
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.getJsonSchemas'() {
      return schemas
    },
  })

  deepStrictEqual(await getJsonSchemas(), schemas)
})
