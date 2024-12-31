import { expect, test } from '@jest/globals'
import { FileNotFoundError } from '../src/parts/FileNotFoundError/FileNotFoundError.ts'

test('FileNotFoundError', () => {
  const error = new FileNotFoundError('/test/file.txt')
  expect(error.message).toBe('File not found: /test/file.txt')
  expect(error.code).toBe('ENOENT')
})
