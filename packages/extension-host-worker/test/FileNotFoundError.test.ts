import { expect, test } from '@jest/globals'
import { FileNotFoundError } from '../src/parts/FileNotFoundError/FileNotFoundError.ts'

test('FileNotFoundError - creates error with correct name and message', () => {
  const error = new FileNotFoundError('test message')
  expect(error.name).toBe('FileNotFoundError')
  expect(error.message).toBe('test message')
  expect(error instanceof Error).toBe(true)
  expect(error instanceof FileNotFoundError).toBe(true)
})
