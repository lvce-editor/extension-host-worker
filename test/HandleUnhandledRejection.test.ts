import { beforeEach, expect, jest, test } from '@jest/globals'
import * as HandleUnhandledRejection from '../src/parts/HandleUnhandledRejection/HandleUnhandledRejection.ts'

beforeEach(() => {
  jest.resetAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

test('handleUnhandledRejection - error with stack', () => {
  const error = new Error('test error')
  error.stack = 'Error: test error\n  at Object.<anonymous> (/test/file.js:1:1)'
  HandleUnhandledRejection.handleUnhandledRejection(error)
  expect(console.error).toHaveBeenCalledTimes(1)
  expect(console.error).toHaveBeenCalledWith(
    '[extension host worker] Unhandled Rejection: test error\nError: test error\n  at Object.<anonymous> (/test/file.js:1:1)'
  )
})

test('handleUnhandledRejection - error without stack', () => {
  const error = new Error('test error')
  error.stack = undefined
  HandleUnhandledRejection.handleUnhandledRejection(error)
  expect(console.error).toHaveBeenCalledTimes(1)
  expect(console.error).toHaveBeenCalledWith('[extension host worker] Unhandled Rejection: test error')
})

test('handleUnhandledRejection - non-error object', () => {
  const error = { message: 'custom error' }
  HandleUnhandledRejection.handleUnhandledRejection(error)
  expect(console.error).toHaveBeenCalledTimes(1)
  expect(console.error).toHaveBeenCalledWith('[extension host worker] Unhandled Rejection: custom error')
})
