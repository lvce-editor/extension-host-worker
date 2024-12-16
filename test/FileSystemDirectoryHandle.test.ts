import { expect, test } from '@jest/globals'
import * as FileSystemDirectoryHandle from '../src/parts/FileSystemDirectoryHandle/FileSystemDirectoryHandle.ts'

test('getChildHandles - gets all child handles from directory', async () => {
  const mockChildHandles = ['file1', 'file2']
  const mockHandle = {
    values: async function* () {
      for (const handle of mockChildHandles) {
        yield handle
      }
    },
    kind: 'directory',
    name: 'test-dir',
    isSameEntry: () => Promise.resolve(true),
  } as FileSystemHandle

  const result = await FileSystemDirectoryHandle.getChildHandles(mockHandle)
  expect(result).toEqual(mockChildHandles)
})

test('getChildHandles - throws error if handle is not an object', async () => {
  await expect(FileSystemDirectoryHandle.getChildHandles('not-an-object' as any)).rejects.toThrow('expected value to be of type object')
})
