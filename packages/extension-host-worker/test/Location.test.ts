import { test, expect } from '@jest/globals'
import { getOrigin } from '../src/parts/Location/Location.ts'

test('getOrigin returns location origin', () => {
  // @ts-ignore
  globalThis.location = {
    origin: 'https://example.com',
  }
  expect(getOrigin()).toBe('https://example.com')
})
