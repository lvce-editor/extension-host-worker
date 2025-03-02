import { test, expect, jest } from '@jest/globals'

jest.unstable_mockModule('../src/parts/PersistentFileHandle/PersistentFileHandle.ts', () => {
  return {
    getHandle: jest.fn(),
  }
})

const GetDirectoryHandle = await import('../src/parts/GetDirectoryHandle/GetDirectoryHandle.ts')
const PersistentFileHandle = await import('../src/parts/PersistentFileHandle/PersistentFileHandle.ts')

test('getDirectoryHandle - should get directory handle', async () => {
  const mockHandle = {
    kind: 'directory',
    name: 'test-dir',
  }
  // @ts-ignore
  PersistentFileHandle.getHandle.mockResolvedValue(mockHandle)
  const result = await GetDirectoryHandle.getDirectoryHandle('test-uri')
  expect(result).toBe(mockHandle)
  expect(PersistentFileHandle.getHandle).toHaveBeenCalledWith('test-uri')
})

test('getDirectoryHandle - should return undefined when handle is not found', async () => {
  // @ts-ignore
  PersistentFileHandle.getHandle.mockResolvedValue(undefined)
  const result = await GetDirectoryHandle.getDirectoryHandle('test-uri')
  expect(result).toBeUndefined()
})

test('getDirectoryHandle - should recursively try parent directory', async () => {
  const mockHandle = {
    kind: 'directory',
    name: 'parent-dir',
  }
  // @ts-ignore
  PersistentFileHandle.getHandle.mockResolvedValueOnce(undefined).mockResolvedValueOnce(mockHandle)
  const result = await GetDirectoryHandle.getDirectoryHandle('/test/file.txt')
  expect(result).toBe(mockHandle)
  expect(PersistentFileHandle.getHandle).toHaveBeenCalledWith('/test/file.txt')
  expect(PersistentFileHandle.getHandle).toHaveBeenCalledWith('/test')
})

test('getDirectoryHandle - should handle root path', async () => {
  // @ts-ignore
  PersistentFileHandle.getHandle.mockResolvedValue(undefined)
  const result = await GetDirectoryHandle.getDirectoryHandle('/')
  expect(result).toBeUndefined()
  expect(PersistentFileHandle.getHandle).toHaveBeenCalledWith('/')
})
