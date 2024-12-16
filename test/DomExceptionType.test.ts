import { expect, test } from '@jest/globals'
import * as DomExceptionType from '../src/parts/DomExceptionType/DomExceptionType.ts'

test('NotReadableError', () => {
  expect(DomExceptionType.NotReadableError).toBe('NotReadableError')
})
