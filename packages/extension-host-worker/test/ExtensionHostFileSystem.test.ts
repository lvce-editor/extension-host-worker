import { beforeEach, expect, jest, test } from '@jest/globals'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import * as ExtensionHostFileSystem from '../src/parts/ExtensionHostFileSystem/ExtensionHostFileSystem.ts'
import * as FileSystemProviderState from '../src/parts/FileSystemProviderState/FileSystemProviderState.ts'

beforeEach(() => {
  FileSystemProviderState.clear()
})

test('registerFileSystemProvider - error - missing id', () => {
  expect(() => {
    ExtensionHostFileSystem.registerFileSystemProvider({
      async readDirWithFileTypes() {
        return [
          {
            name: 'abc.txt',
            type: 'file',
          },
        ]
      },
    })
  }).toThrow(new Error('Failed to register file system provider: missing id'))
})

test('readFile - isolated provider', async () => {
  using mockRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeFileSystemProviderReadFile': async (providerId: string, uri: string) => {
      return {
        found: true,
        result: `${providerId}:${uri}`,
      }
    },
  })

  await expect(ExtensionHostFileSystem.readFile('git-file-before', 'file:///workspace/file.txt')).resolves.toBe(
    'git-file-before:file:///workspace/file.txt',
  )
  expect(mockRpc.invocations).toEqual([['Extensions.executeFileSystemProviderReadFile', 'git-file-before', 'file:///workspace/file.txt']])
})

test('readDirWithFileTypes', async () => {
  ExtensionHostFileSystem.registerFileSystemProvider({
    id: 'memfs',
    async readDirWithFileTypes() {
      return [
        {
          name: 'abc.txt',
          type: 'file',
        },
      ]
    },
  })
  expect(await ExtensionHostFileSystem.readDirWithFileTypes('memfs', 'memfs://abc')).toEqual([
    {
      name: 'abc.txt',
      type: 'file',
    },
  ])
})

test('readDirWithFileTypes - isolated provider', async () => {
  using mockRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeFileSystemProviderReadDirWithFileTypes': async (providerId: string, uri: string) => {
      return {
        found: true,
        result: [{ name: `${providerId}:${uri}`, type: 'file' }],
      }
    },
  })

  await expect(ExtensionHostFileSystem.readDirWithFileTypes('fetch', 'fetch:///workspace')).resolves.toEqual([
    { name: 'fetch:fetch:///workspace', type: 'file' },
  ])
  expect(mockRpc.invocations).toEqual([['Extensions.executeFileSystemProviderReadDirWithFileTypes', 'fetch', 'fetch:///workspace']])
})

test('readDirWithFileTypes - when file system provider throws error', async () => {
  ExtensionHostFileSystem.registerFileSystemProvider({
    id: 'memfs',
    async readDirWithFileTypes() {
      throw new Error('x is not a function')
    },
  })
  await expect(ExtensionHostFileSystem.readDirWithFileTypes('memfs', 'memfs://abc')).rejects.toThrow(
    new Error('Failed to execute file system provider: x is not a function'),
  )
})

test('readFile', async () => {
  ExtensionHostFileSystem.registerFileSystemProvider({
    id: 'memfs',
    async readFile() {
      return 'abc'
    },
  })
  expect(await ExtensionHostFileSystem.readFile('memfs', 'memfs://abc.txt')).toBe('abc')
})

test('readFile - when file system provider throws error', async () => {
  ExtensionHostFileSystem.registerFileSystemProvider({
    id: 'memfs',
    async readFile() {
      throw new Error('x is not a function')
    },
  })
  await expect(ExtensionHostFileSystem.readFile('memfs', 'memfs://abc.txt')).rejects.toThrow(
    new Error('Failed to execute file system provider: x is not a function'),
  )
})

test('remove', async () => {
  const fileSystemProvider = {
    id: 'memfs',
    remove: jest.fn(),
  }
  ExtensionHostFileSystem.registerFileSystemProvider(fileSystemProvider)
  await ExtensionHostFileSystem.remove('memfs', 'memfs://abc.txt')
  expect(fileSystemProvider.remove).toHaveBeenCalledWith('memfs://abc.txt')
})

test('remove - when file system provider throws error', async () => {
  ExtensionHostFileSystem.registerFileSystemProvider({
    id: 'memfs',
    async remove() {
      throw new Error('x is not a function')
    },
  })
  await expect(ExtensionHostFileSystem.remove('memfs', 'memfs://abc.txt')).rejects.toThrow(
    new Error('Failed to execute file system provider: x is not a function'),
  )
})

test('rename', async () => {
  const fileSystemProvider = {
    id: 'memfs',
    rename: jest.fn(),
  }
  ExtensionHostFileSystem.registerFileSystemProvider(fileSystemProvider)
  await ExtensionHostFileSystem.rename('memfs', 'memfs://abc.txt', 'memfs://def.txt')
  expect(fileSystemProvider.rename).toHaveBeenCalledWith('memfs://abc.txt', 'memfs://def.txt')
})

test('rename - when file system provider throws error', async () => {
  ExtensionHostFileSystem.registerFileSystemProvider({
    id: 'memfs',
    async rename() {
      throw new Error('x is not a function')
    },
  })
  await expect(ExtensionHostFileSystem.rename('memfs', 'memfs://abc.txt', 'memfs://def.txt')).rejects.toThrow(
    new Error('Failed to execute file system provider: x is not a function'),
  )
})

test('rename - when file system provider is not registered', async () => {
  await expect(ExtensionHostFileSystem.rename('memfs', 'memfs://abc.txt', 'memfs://def.txt')).rejects.toThrow(
    new Error('Failed to execute file system provider: no file system provider for protocol "memfs" found'),
  )
})

test('getPathSeparator - slash', async () => {
  ExtensionHostFileSystem.registerFileSystemProvider({
    id: 'memfs',
    pathSeparator: '/',
    async readDirWithFileTypes() {
      return [
        {
          name: 'abc.txt',
          type: 'file',
        },
      ]
    },
  })
  await expect(ExtensionHostFileSystem.getPathSeparator('memfs')).resolves.toBe('/')
})

test('getPathSeparator - backslash', async () => {
  ExtensionHostFileSystem.registerFileSystemProvider({
    id: 'memfs',
    pathSeparator: '\\',
    async readDirWithFileTypes() {
      return [
        {
          name: 'abc.txt',
          type: 'file',
        },
      ]
    },
  })
  await expect(ExtensionHostFileSystem.getPathSeparator('memfs')).resolves.toBe('\\')
})

test('getPathSeparator - isolated provider', async () => {
  using mockRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeFileSystemProviderGetPathSeparator': async () => {
      return {
        found: true,
        result: '/',
      }
    },
  })

  await expect(ExtensionHostFileSystem.getPathSeparator('fetch')).resolves.toBe('/')
  expect(mockRpc.invocations).toEqual([['Extensions.executeFileSystemProviderGetPathSeparator', 'fetch']])
})

test('isReadonly - default false', async () => {
  ExtensionHostFileSystem.registerFileSystemProvider({
    id: 'memfs',
  })
  await expect(ExtensionHostFileSystem.isReadonly('memfs')).resolves.toBe(false)
})

test('isReadonly', async () => {
  ExtensionHostFileSystem.registerFileSystemProvider({
    id: 'memfs',
    isReadonly() {
      return true
    },
  })
  await expect(ExtensionHostFileSystem.isReadonly('memfs')).resolves.toBe(true)
})

test('isReadonly - isolated provider', async () => {
  using mockRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeFileSystemProviderIsReadonly': async () => {
      return {
        found: true,
        result: true,
      }
    },
  })

  await expect(ExtensionHostFileSystem.isReadonly('fetch')).resolves.toBe(true)
  expect(mockRpc.invocations).toEqual([['Extensions.executeFileSystemProviderIsReadonly', 'fetch']])
})

test('isReadonly - when file system provider throws error', async () => {
  ExtensionHostFileSystem.registerFileSystemProvider({
    id: 'memfs',
    isReadonly() {
      throw new Error('x is not a function')
    },
  })
  await expect(ExtensionHostFileSystem.isReadonly('memfs')).rejects.toThrow(new Error('Failed to execute file system provider: x is not a function'))
})
