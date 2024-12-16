import { expect, test } from '@jest/globals'
import * as BrowserErrorTypes from '../src/parts/BrowserErrorTypes/BrowserErrorTypes.ts'
import * as DomExceptionType from '../src/parts/DomExceptionType/DomExceptionType.ts'

test('isNotReadableError - with NotReadableError', () => {
  const error = {
    name: DomExceptionType.NotReadableError,
  }
  expect(BrowserErrorTypes.isNotReadableError(error)).toBe(true)
})

test('isNotReadableError - with different error', () => {
  const error = {
    name: 'TypeError',
  }
  expect(BrowserErrorTypes.isNotReadableError(error)).toBe(false)
})

test('isNotReadableError - with undefined', () => {
  expect(BrowserErrorTypes.isNotReadableError(undefined)).toBe(undefined)
})

test('isNotReadableError - with null', () => {
  expect(BrowserErrorTypes.isNotReadableError(null)).toBe(null)
})

test('isNotReadableError - with non-error object', () => {
  const nonError = {
    message: 'test',
  }
  expect(BrowserErrorTypes.isNotReadableError(nonError)).toBe(false)
})
