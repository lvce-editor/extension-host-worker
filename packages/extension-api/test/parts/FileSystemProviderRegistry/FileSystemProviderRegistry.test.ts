import { deepStrictEqual, rejects, strictEqual, throws } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  executeFileSystemProviderReadFile,
  getFileSystemProviderRegistrySnapshot,
  registerFileSystemProvider,
  resetFileSystemProviderRegistry,
} from '../../../src/parts/FileSystemProviderRegistry/FileSystemProviderRegistry.ts'

afterEach(() => {
  resetFileSystemProviderRegistry()
})

test('registerFileSystemProvider registers and reads files', async () => {
  const disposable = registerFileSystemProvider({
    id: 'git-file-before',
    readFile(uri) {
      return `before:${uri}`
    },
  })

  deepStrictEqual(getFileSystemProviderRegistrySnapshot(), {
    providers: [{ id: 'git-file-before' }],
  })
  strictEqual(await executeFileSystemProviderReadFile('git-file-before', 'file:///workspace/file.txt'), 'before:file:///workspace/file.txt')

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
