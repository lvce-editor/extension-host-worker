import { deepStrictEqual, rejects, strictEqual, throws } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  executeFileSystemProviderGetPathSeparator,
  executeFileSystemProviderIsReadonly,
  executeFileSystemProviderReadDirWithFileTypes,
  executeFileSystemProviderReadFile,
  getFileSystemProviderRegistrySnapshot,
  registerFileSystemProvider,
  resetFileSystemProviderRegistry,
} from '../../../src/parts/FileSystemProviderRegistry/FileSystemProviderRegistry.ts'

afterEach(() => {
  resetFileSystemProviderRegistry()
})

test('registerFileSystemProvider registers and executes provider operations', async () => {
  const disposable = registerFileSystemProvider({
    id: 'git-file-before',
    isReadonly() {
      return true
    },
    pathSeparator: '/',
    readDirWithFileTypes(uri) {
      return [{ name: uri, type: 1 }]
    },
    readFile(uri) {
      return `before:${uri}`
    },
  })

  deepStrictEqual(getFileSystemProviderRegistrySnapshot(), {
    providers: [{ id: 'git-file-before' }],
  })
  strictEqual(await executeFileSystemProviderReadFile('git-file-before', 'file:///workspace/file.txt'), 'before:file:///workspace/file.txt')
  deepStrictEqual(await executeFileSystemProviderReadDirWithFileTypes('git-file-before', 'file:///workspace'), [
    { name: 'file:///workspace', type: 1 },
  ])
  strictEqual(executeFileSystemProviderGetPathSeparator('git-file-before'), '/')
  strictEqual(await executeFileSystemProviderIsReadonly('git-file-before'), true)

  disposable.dispose()
  deepStrictEqual(getFileSystemProviderRegistrySnapshot(), { providers: [] })
})

test('registerFileSystemProvider rejects a missing readFile function', () => {
  throws(() => {
    registerFileSystemProvider({
      id: 'invalid',
      // @ts-expect-error testing invalid provider shape
      readFile: undefined,
    })
  }, /file system provider invalid is missing readFile function/)
})

test('executeFileSystemProviderReadFile rejects an unknown provider', async () => {
  await rejects(executeFileSystemProviderReadFile('missing', 'file:///workspace/file.txt'), /file system provider missing not found/)
})

test('optional provider metadata uses writable posix defaults', async () => {
  registerFileSystemProvider({
    id: 'minimal',
    readFile() {
      return ''
    },
  })

  strictEqual(executeFileSystemProviderGetPathSeparator('minimal'), '/')
  strictEqual(await executeFileSystemProviderIsReadonly('minimal'), false)
  await rejects(executeFileSystemProviderReadDirWithFileTypes('minimal', 'file:///workspace'), /missing readDirWithFileTypes function/)
})

test('registerFileSystemProvider rejects invalid optional operations', () => {
  throws(() => {
    registerFileSystemProvider({
      id: 'invalid',
      // @ts-expect-error testing invalid provider shape
      isReadonly: true,
      readFile() {
        return ''
      },
    })
  }, /file system provider invalid has invalid isReadonly function/)
})
