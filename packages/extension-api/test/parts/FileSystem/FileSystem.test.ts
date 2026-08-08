import { ExtensionManagementWorker, FileSystemWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  exists,
  getFileHash,
  mkdir,
  readAsObjectUrl,
  readDirWithFileTypes,
  readFile,
  readFileAsBlob,
  remove,
  stat,
  writeFile,
} from '../../../src/parts/FileSystem/FileSystem.ts'

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

test('readFileAsBlob reads binary content through the file system worker', async () => {
  let invokedUri = ''
  const blob = new Blob(['sample content'])
  mockRpc = FileSystemWorker.registerMockRpc({
    async 'FileSystem.readFileAsBlob'(uri: string): Promise<Blob> {
      invokedUri = uri
      return blob
    },
  })

  const result = await readFileAsBlob('/tmp/sample.bin')

  strictEqual(result, blob)
  strictEqual(invokedUri, '/tmp/sample.bin')
})

test('getFileHash reads the content hash through the file system worker', async () => {
  let invokedUri = ''
  mockRpc = FileSystemWorker.registerMockRpc({
    async 'FileSystem.getFileHash'(uri: string): Promise<string> {
      invokedUri = uri
      return 'sample-hash'
    },
  })

  const result = await getFileHash('/tmp/sample.txt')

  strictEqual(result, 'sample-hash')
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

test('readAsObjectUrl reads a web file as a browser object URL', async () => {
  const invocations: [string, ...unknown[]][] = []
  mockExtensionManagementRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(id: string, ...args: readonly unknown[]): Promise<unknown> {
      invocations.push([id, ...args])
      if (id === 'Layout.getPlatform') {
        return 1
      }
      return 'blob:https://example.com/image-id'
    },
  })

  const result = await readAsObjectUrl('html:///workspace/image.png')

  deepStrictEqual(result, {
    error: '',
    objectUrl: 'blob:https://example.com/image-id',
    wasFound: true,
  })
  deepStrictEqual(invocations, [['Layout.getPlatform'], ['Blob.getSrc', 'html:///workspace/image.png']])
})

test('readAsObjectUrl reads a memfs file as a browser object URL', async () => {
  const invocations: [string, ...unknown[]][] = []
  mockExtensionManagementRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(id: string, ...args: readonly unknown[]): Promise<unknown> {
      invocations.push([id, ...args])
      return 'blob:https://example.com/image-id'
    },
  })

  const result = await readAsObjectUrl('memfs:///workspace/image.png')

  deepStrictEqual(result, {
    error: '',
    objectUrl: 'blob:https://example.com/image-id',
    wasFound: true,
  })
  deepStrictEqual(invocations, [['Blob.getSrc', 'memfs:///workspace/image.png']])
})

test('readAsObjectUrl returns a remote URL for an Electron file', async () => {
  mockExtensionManagementRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(id: string): Promise<number> {
      strictEqual(id, 'Layout.getPlatform')
      return 2
    },
  })

  const result = await readAsObjectUrl('file:///workspace/image.png')

  deepStrictEqual(result, {
    error: '',
    objectUrl: '/remote/workspace/image.png',
    wasFound: true,
  })
})

test('readAsObjectUrl returns a remote URL for a Windows file', async () => {
  mockExtensionManagementRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(id: string): Promise<number> {
      strictEqual(id, 'Layout.getPlatform')
      return 3
    },
  })

  const result = await readAsObjectUrl('file:///C:\\workspace\\image.png')

  deepStrictEqual(result, {
    error: '',
    objectUrl: '/remote/C:/workspace/image.png',
    wasFound: true,
  })
})

test('readAsObjectUrl preserves an HTTP URL', async () => {
  const result = await readAsObjectUrl('https://example.com/image.png')

  deepStrictEqual(result, {
    error: '',
    objectUrl: 'https://example.com/image.png',
    wasFound: true,
  })
})

test('readAsObjectUrl returns the error when the file cannot be read', async () => {
  mockExtensionManagementRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(id: string): Promise<number> {
      if (id === 'Layout.getPlatform') {
        return 1
      }
      throw new Error('File not found')
    },
  })

  const result = await readAsObjectUrl('html:///workspace/missing.png')

  deepStrictEqual(result, {
    error: 'File not found',
    objectUrl: '',
    wasFound: false,
  })
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

test('stat reads file metadata through the file system worker', async () => {
  let invokedUri = ''
  const stats = {
    isDirectory: false,
    size: 42,
  }
  mockRpc = FileSystemWorker.registerMockRpc({
    async 'FileSystem.stat'(uri: string): Promise<unknown> {
      invokedUri = uri
      return stats
    },
  })

  const result = await stat('/tmp/sample.txt')

  deepStrictEqual(result, stats)
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
