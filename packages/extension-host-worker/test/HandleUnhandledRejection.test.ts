import { beforeEach, expect, jest, test } from '@jest/globals'
import * as HandleUnhandledRejection from '../src/parts/HandleUnhandledRejection/HandleUnhandledRejection.ts'

class MockPromiseRejectionEvent {
  type = 'unhandledrejection'
  promise: Promise<any>
  reason: any
  preventDefault: jest.Mock

  constructor(type: string, init: { promise: Promise<any>; reason: any }) {
    this.promise = init.promise
    this.reason = init.reason
    this.preventDefault = jest.fn()
  }
}

beforeEach(() => {
  jest.resetAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {})
  // @ts-ignore
  globalThis.PromiseRejectionEvent = MockPromiseRejectionEvent
})

test('handleUnhandledRejection - error with stack', () => {
  const error = new Error('test error')
  error.stack = 'Error: test error\n  at Object.<anonymous> (/test/file.js:1:1)'
  HandleUnhandledRejection.handleUnhandledRejection(error)
  expect(console.error).toHaveBeenCalledTimes(1)
  expect(console.error).toHaveBeenCalledWith(
    '[extension host worker] Unhandled Rejection: test error\nError: test error\n  at Object.<anonymous> (/test/file.js:1:1)',
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

test('handleUnhandledRejection - PromiseRejectionEvent with Error', () => {
  const error = new Error('test error')
  error.stack = 'Error: test error\n  at Object.<anonymous> (/test/file.js:1:1)'
  const event = new MockPromiseRejectionEvent('unhandledrejection', {
    promise: Promise.reject(error),
    reason: error,
  })
  HandleUnhandledRejection.handleUnhandledRejection(event)
  expect(console.error).toHaveBeenCalledTimes(1)
  expect(console.error).toHaveBeenCalledWith(
    '[extension host worker] Unhandled Rejection: test error\nError: test error\n  at Object.<anonymous> (/test/file.js:1:1)',
  )
  expect(event.preventDefault).toHaveBeenCalledTimes(1)
})

test('handleUnhandledRejection - PromiseRejectionEvent with non-Error reason', () => {
  const customError = { message: 'custom error' }
  const event = new MockPromiseRejectionEvent('unhandledrejection', {
    promise: Promise.reject(customError),
    reason: customError,
  })
  HandleUnhandledRejection.handleUnhandledRejection(event)
  expect(console.error).toHaveBeenCalledTimes(1)
  expect(console.error).toHaveBeenCalledWith('[extension host worker] Unhandled Rejection: custom error')
  expect(event.preventDefault).toHaveBeenCalledTimes(1)
})
