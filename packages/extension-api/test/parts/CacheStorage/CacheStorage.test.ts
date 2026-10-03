import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { getCacheStorageItem, removeCacheStorageItem, setCacheStorageItem } from '../../../src/parts/CacheStorage/CacheStorage.ts'
import { disposeCacheWorker } from '../../../src/parts/CacheWorker/CacheWorker.ts'

let rpc: { [Symbol.dispose](): void } | undefined

afterEach(async () => {
  rpc?.[Symbol.dispose]()
  rpc = undefined
  await disposeCacheWorker()
})

test('opens one lazy direct cache-worker connection and round-trips namespaced Blob metadata', async () => {
  const entries = new Map<string, { readonly blob: Blob; readonly headers: Readonly<Record<string, string>> }>()
  const calls: unknown[][] = []
  let transfers = 0
  rpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.sendMessagePortToCacheWorker'(port: MessagePort): Promise<void> {
      transfers++
      await PlainMessagePortRpc.create({
        commandMap: {
          async 'ExtensionsCache.getCacheStorageItem'(key: string) {
            calls.push(['get', key])
            const entry = entries.get(key)
            if (!entry) return null
            return { body: await entry.blob.arrayBuffer(), headers: entry.headers, status: 200, statusText: 'OK' }
          },
          'ExtensionsCache.removeCacheStorageItem'(key: string) {
            calls.push(['remove', key])
            return entries.delete(key)
          },
          'ExtensionsCache.setCacheStorageItem'(key: string, blob: Blob, headers: Readonly<Record<string, string>>) {
            calls.push(['set', key, blob])
            entries.set(key, { blob, headers: Object.fromEntries(new Headers(headers).entries()) })
            return { success: true }
          },
        },
        messagePort: port,
      })
    },
  })

  const key = 'preview/item.webp'
  const blob = new Blob(['transformed-image'], { type: 'image/webp' })
  strictEqual(transfers, 0)
  deepStrictEqual(
    await Promise.all([
      setCacheStorageItem(key, blob, { 'Content-Type': blob.type }),
      setCacheStorageItem('other/item.webp', blob, { 'Content-Type': blob.type }),
    ]),
    [{ success: true }, { success: true }],
  )
  strictEqual(transfers, 1)
  const item = await getCacheStorageItem(key)
  strictEqual(item?.blob.type, 'image/webp')
  strictEqual(await item?.blob.text(), 'transformed-image')
  strictEqual(item?.headers['content-type'], 'image/webp')
  strictEqual(await removeCacheStorageItem(key), true)
  strictEqual(await getCacheStorageItem(key), null)
  deepStrictEqual(
    calls.map((call) => call[0]),
    ['set', 'set', 'get', 'remove', 'get'],
  )
})
