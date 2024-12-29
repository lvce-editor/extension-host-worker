import { expect, jest, test } from '@jest/globals'
import * as FileSystemFileHandle from '../src/parts/FileSystemFileHandle/FileSystemFileHandle.ts'

test('getFile - returns file from handle', async () => {
  const mockFile = new File(['test content'], 'test.txt', {
    type: 'text/plain',
  })
  const mockHandle = {
    // @ts-ignore
    getFile: jest.fn().mockResolvedValue(mockFile),
  }
  // @ts-ignore
  const result = await FileSystemFileHandle.getFile(mockHandle)
  expect(result).toBe(mockFile)
  expect(mockHandle.getFile).toHaveBeenCalled()
})

test('getFile - propagates error from handle', async () => {
  const mockError = new Error('Failed to get file')
  const mockHandle = {
    // @ts-ignore
    getFile: jest.fn().mockRejectedValue(mockError),
  }
  // @ts-ignore
  await expect(FileSystemFileHandle.getFile(mockHandle)).rejects.toThrow('Failed to get file')
  expect(mockHandle.getFile).toHaveBeenCalled()
})
