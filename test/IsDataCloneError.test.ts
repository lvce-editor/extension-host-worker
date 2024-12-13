import { expect, test } from '@jest/globals'
import * as IsDataCloneError from '../src/parts/IsDataCloneError/IsDataCloneError.ts'

test('isDataCloneError', () => {
  const error = new DOMException('failed to clone', 'DataCloneError')
  expect(IsDataCloneError.isDataCloneError(error)).toBe(true)
})

test('isDataCloneError - other error', () => {
  const error = new TypeError('x is not a function')
  expect(IsDataCloneError.isDataCloneError(error)).toBe(false)
})
