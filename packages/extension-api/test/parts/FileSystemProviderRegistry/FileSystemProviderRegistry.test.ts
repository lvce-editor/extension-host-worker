import { deepStrictEqual, rejects, strictEqual, throws } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  executeFileSystemProviderGetPathSeparator,
  executeFileSystemProviderIsReadonly,
  executeFileSystemProviderMkdir,
  executeFileSystemProviderReadDirWithFileTypes,
  executeFileSystemProviderReadFile,
  executeFileSystemProviderRemove,
  executeFileSystemProviderRename,
  executeFileSystemProviderWriteFile,
  getFileSystemProviderRegistrySnapshot,
  registerFileSystemProvider,
  resetFileSystemProviderRegistry,
} from '../../../src/parts/FileSystemProviderRegistry/FileSystemProviderRegistry.ts'

afterEach(() => {
  resetFileSystemProviderRegistry()
})

test('registerFileSystemProvider registers and executes provider operations', async () => {
  const invocations: unknown[][] = []
  const disposable = registerFileSystemProvider({
    id: 'git-file-before',
    isReadonly() {
      return true
    },
    mkdir(uri) {
      invocations.push(['mkdir', uri])
    },
    pathSeparator: '/',
    readDirWithFileTypes(uri) {
      return [{ name: uri, type: 1 }]
    },
    readFile(uri) {
      return `before:${uri}`
    },
    remove(uri) {
      invocations.push(['remove', uri])
    },
    rename(oldUri, newUri) {
      invocations.push(['rename', oldUri, newUri])
    },
    writeFile(uri, content) {
      invocations.push(['writeFile', uri, content])
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
  await executeFileSystemProviderMkdir('git-file-before', 'file:///workspace/folder')
  await executeFileSystemProviderWriteFile('git-file-before', 'file:///workspace/file.txt', 'updated')
  await executeFileSystemProviderRename('git-file-before', 'file:///workspace/file.txt', 'file:///workspace/renamed.txt')
  await executeFileSystemProviderRemove('git-file-before', 'file:///workspace/renamed.txt')
  deepStrictEqual(invocations, [
    ['mkdir', 'file:///workspace/folder'],
    ['writeFile', 'file:///workspace/file.txt', 'updated'],
    ['rename', 'file:///workspace/file.txt', 'file:///workspace/renamed.txt'],
    ['remove', 'file:///workspace/renamed.txt'],
  ])

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

  throws(() => {
    registerFileSystemProvider({
      id: 'invalid-write',
      readFile() {
        return ''
      },
      // @ts-expect-error testing invalid provider shape
      writeFile: true,
    })
  }, /file system provider invalid-write has invalid writeFile function/)
})

test('missing writable operations reject clearly', async () => {
  registerFileSystemProvider({
    id: 'read-only',
    readFile() {
      return ''
    },
  })

  await rejects(executeFileSystemProviderMkdir('read-only', 'file:///workspace/folder'), /missing mkdir function/)
  await rejects(executeFileSystemProviderRemove('read-only', 'file:///workspace/file.txt'), /missing remove function/)
  await rejects(
    executeFileSystemProviderRename('read-only', 'file:///workspace/file.txt', 'file:///workspace/renamed.txt'),
    /missing rename function/,
  )
  await rejects(executeFileSystemProviderWriteFile('read-only', 'file:///workspace/file.txt', 'updated'), /missing writeFile function/)
})
