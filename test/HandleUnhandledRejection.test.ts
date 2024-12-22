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

test('handleUnhandledRejection - null', () => {
  HandleUnhandledRejection.handleUnhandledRejection(null)
  expect(console.error).toHaveBeenCalledTimes(1)
  expect(console.error).toHaveBeenCalledWith('[extension host worker] Unhandled Rejection: null')
})

test('handleUnhandledRejection - undefined', () => {
  HandleUnhandledRejection.handleUnhandledRejection(undefined)
  expect(console.error).toHaveBeenCalledTimes(1)
  expect(console.error).toHaveBeenCalledWith('[extension host worker] Unhandled Rejection: undefined')
})

test('handleUnhandledRejection - number', () => {
  HandleUnhandledRejection.handleUnhandledRejection(42)
  expect(console.error).toHaveBeenCalledTimes(1)
  expect(console.error).toHaveBeenCalledWith('[extension host worker] Unhandled Rejection: 42')
})

test('handleUnhandledRejection - boolean', () => {
  HandleUnhandledRejection.handleUnhandledRejection(true)
  expect(console.error).toHaveBeenCalledTimes(1)
  expect(console.error).toHaveBeenCalledWith('[extension host worker] Unhandled Rejection: true')
})

test('handleUnhandledRejection - string', () => {
  HandleUnhandledRejection.handleUnhandledRejection('error message')
  expect(console.error).toHaveBeenCalledTimes(1)
  expect(console.error).toHaveBeenCalledWith('[extension host worker] Unhandled Rejection: error message')
})

test('handleUnhandledRejection - array', () => {
  HandleUnhandledRejection.handleUnhandledRejection([1, 2, 3])
  expect(console.error).toHaveBeenCalledTimes(1)
  expect(console.error).toHaveBeenCalledWith('[extension host worker] Unhandled Rejection: 1,2,3')
})

test('handleUnhandledRejection - symbol', () => {
  const sym = Symbol('test')
  HandleUnhandledRejection.handleUnhandledRejection(sym)
  expect(console.error).toHaveBeenCalledTimes(1)
  expect(console.error).toHaveBeenCalledWith('[extension host worker] Unhandled Rejection: Symbol(test)')
})
