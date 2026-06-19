import { FileSystemWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { exists, readDirWithFileTypes, readFile } from '../../../src/parts/FileSystem/FileSystem.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

let mockRpc: MockRpcDisposable | undefined

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

test('readFile reads through the file system worker', async () => {
  let invokedUri = ''
  mockRpc = FileSystemWorker.registerMockRpc({
    async 'FileSystem.readFile'(uri: string): Promise<string> {
      invokedUri = uri
      return 'sample content'
    },
  })

  const result = await readFile('/tmp/sample.txt')

  strictEqual(result, 'sample content')
  strictEqual(invokedUri, '/tmp/sample.txt')
})

test('exists checks through the file system worker', async () => {
  let invokedUri = ''
  mockRpc = FileSystemWorker.registerMockRpc({
    async 'FileSystem.exists'(uri: string): Promise<boolean> {
      invokedUri = uri
      return true
    },
  })

  const result = await exists('/tmp/sample.txt')

  strictEqual(result, true)
  strictEqual(invokedUri, '/tmp/sample.txt')
})

test('readDirWithFileTypes reads through the file system worker', async () => {
  let invokedUri = ''
  const dirents = [
    {
      name: 'sample.txt',
      type: 7,
    },
  ]
  mockRpc = FileSystemWorker.registerMockRpc({
    async 'FileSystem.readDirWithFileTypes'(uri: string): Promise<readonly unknown[]> {
      invokedUri = uri
      return dirents
    },
  })

  const result = await readDirWithFileTypes('/tmp')

  deepStrictEqual(result, dirents)
  strictEqual(invokedUri, '/tmp')
})
