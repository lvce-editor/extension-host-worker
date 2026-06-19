import { ExtensionManagementWorker, FileSystemWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { exists, mkdir, readDirWithFileTypes, readFile, remove, writeFile } from '../../../src/parts/FileSystem/FileSystem.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

let mockExtensionManagementRpc: MockRpcDisposable | undefined
let mockRpc: MockRpcDisposable | undefined

afterEach(() => {
  mockExtensionManagementRpc?.[Symbol.dispose]()
  mockRpc?.[Symbol.dispose]()
  mockExtensionManagementRpc = undefined
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

test('readFile reads memfs files through the extension api host command', async () => {
  let invokedUri = ''
  mockExtensionManagementRpc = ExtensionManagementWorker.registerMockRpc({
    async 'ExtensionApi.readFile'(uri: string): Promise<string> {
      invokedUri = uri
      return 'ignored.js'
    },
  })

  const result = await readFile('memfs:///workspace/.prettierignore')

  strictEqual(result, 'ignored.js')
  strictEqual(invokedUri, 'memfs:///workspace/.prettierignore')
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

test('mkdir creates through the file system worker', async () => {
  let invokedUri = ''
  mockRpc = FileSystemWorker.registerMockRpc({
    async 'FileSystem.mkdir'(uri: string): Promise<void> {
      invokedUri = uri
    },
  })

  await mkdir('/tmp/folder')

  strictEqual(invokedUri, '/tmp/folder')
})

test('remove deletes through the file system worker', async () => {
  let invokedUri = ''
  mockRpc = FileSystemWorker.registerMockRpc({
    async 'FileSystem.remove'(uri: string): Promise<void> {
      invokedUri = uri
    },
  })

  await remove('/tmp/sample.txt')

  strictEqual(invokedUri, '/tmp/sample.txt')
})

test('writeFile writes through the file system worker', async () => {
  let invokedUri = ''
  let invokedContent = ''
  mockRpc = FileSystemWorker.registerMockRpc({
    async 'FileSystem.writeFile'(uri: string, content: string): Promise<void> {
      invokedUri = uri
      invokedContent = content
    },
  })

  await writeFile('/tmp/sample.txt', 'sample content')

  strictEqual(invokedUri, '/tmp/sample.txt')
  strictEqual(invokedContent, 'sample content')
})
