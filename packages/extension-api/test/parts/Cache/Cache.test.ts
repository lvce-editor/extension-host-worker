import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, rejects, strictEqual } from 'node:assert/strict'
import { test } from 'node:test'
import { getCacheFileHandle } from '../../../src/parts/Cache/Cache.ts'

test('returns a cache file handle without choosing an extension namespace or opening it', async () => {
  const handle = { kind: 'file', name: 'files-v1' }
  using rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.getCacheFileHandle': () => handle,
  })
  strictEqual(await getCacheFileHandle('files-v1'), handle)
  deepStrictEqual(rpc.invocations, [['Extensions.getCacheFileHandle', 'files-v1']])
})

test('propagates unavailable storage so callers can fall back', async () => {
  using rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.getCacheFileHandle': () => {
      throw new Error('storage unavailable')
    },
  })
  await rejects(getCacheFileHandle('files-v1'), /storage unavailable/)
  strictEqual(rpc.invocations.length, 1)
})
