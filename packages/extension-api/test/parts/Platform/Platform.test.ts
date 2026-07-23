import { type DisposableMockRpc, ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { rejects, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { getPlatform } from '../../../src/parts/Platform/Platform.ts'

let mockRpc: DisposableMockRpc | undefined

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

const mockPlatform = (platform: number): void => {
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(id: string): Promise<number> {
      strictEqual(id, 'Layout.getPlatform')
      return platform
    },
  })
}

test('returns web platform', async () => {
  mockPlatform(1)
  strictEqual(await getPlatform(), 'web')
})

test('returns electron platform', async () => {
  mockPlatform(2)
  strictEqual(await getPlatform(), 'electron')
})

test('returns remote platform', async () => {
  mockPlatform(3)
  strictEqual(await getPlatform(), 'remote')
})

test('returns test platform', async () => {
  mockPlatform(4)
  strictEqual(await getPlatform(), 'test')
})

test('throws for an unknown platform', async () => {
  mockPlatform(99)
  await rejects(getPlatform(), {
    message: 'Unknown platform: 99',
    name: 'TypeError',
  })
})
