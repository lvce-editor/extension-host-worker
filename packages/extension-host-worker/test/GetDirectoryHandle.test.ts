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
  expect(result).toEqual(mockHandle)
  expect(PersistentFileHandle.getHandle).toHaveBeenCalledWith('test-uri')
})

test('getDirectoryHandle - should throw error when handle cannot be obtained', async () => {
  // @ts-ignore
  PersistentFileHandle.getHandle.mockRejectedValue(new Error('Failed to get handle'))

  await expect(GetDirectoryHandle.getDirectoryHandle('test-uri')).rejects.toThrow('Failed to get handle')
})
